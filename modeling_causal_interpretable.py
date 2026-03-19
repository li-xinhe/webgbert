from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Tuple

import torch
import torch.nn as nn

from transformers import AutoConfig, AutoModel, PreTrainedModel
from transformers.modeling_outputs import ModelOutput
from transformers.utils import logging

from configuration_causal_interpretable import CausalInterpretableConfig

logger = logging.get_logger(__name__)


@dataclass
class CausalInterpretableOutput(ModelOutput):
    loss: Optional[torch.Tensor] = None
    logits: torch.Tensor = None

    logits_text: Optional[torch.Tensor] = None
    logits_macro_sum: Optional[torch.Tensor] = None
    logits_country: Optional[torch.Tensor] = None
    logits_year: Optional[torch.Tensor] = None
    logits_interaction: Optional[torch.Tensor] = None
    logits_macro_each: Optional[Tuple[torch.Tensor, ...]] = None


class MacroSubNet(nn.Module):
    def __init__(self, num_labels: int, hidden_dim: int = 16):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(1, hidden_dim),
            nn.Tanh(),
            nn.Linear(hidden_dim, num_labels),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


class MacroTokenEncoder(nn.Module):
    def __init__(self, d_model: int, hidden: int = 64, dropout: float = 0.1):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(1, hidden),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden, d_model),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.net(x)


def _build_text_config_from_dict(cfg: dict):
    """
    Compatibility across older Transformers:
      - use AutoConfig.for_model(model_type, **kwargs)
      - but remove model_type from kwargs to avoid double-passing
    """
    if not isinstance(cfg, dict):
        raise TypeError("text_config must be a dict.")

    if "model_type" not in cfg:
        raise ValueError("text_config dict missing 'model_type'.")

    model_type = cfg["model_type"]
    cfg_kwargs = dict(cfg)
    cfg_kwargs.pop("model_type", None)  # critical fix

    # Some configs include keys that for_model doesn't accept; guard by best-effort:
    try:
        return AutoConfig.for_model(model_type, **cfg_kwargs)
    except TypeError:
        # Fallback: create base config and then set attributes that exist
        base = AutoConfig.for_model(model_type)
        for k, v in cfg_kwargs.items():
            if hasattr(base, k):
                setattr(base, k, v)
        return base


class CausalInterpretableForSequenceClassification(PreTrainedModel):
    config_class = CausalInterpretableConfig
    base_model_prefix = "causal_interpretable"

    def __init__(self, config: CausalInterpretableConfig):
        super().__init__(config)

        # ----- Text backbone -----
        if config.text_config is not None:
            text_cfg = _build_text_config_from_dict(config.text_config)
            self.text_encoder = AutoModel.from_config(text_cfg)
        else:
            text_cfg = AutoConfig.from_pretrained(config.text_model_name_or_path)
            self.text_encoder = AutoModel.from_config(text_cfg)

        D = self.text_encoder.config.hidden_size
        K = config.num_labels
        M = config.num_macro
        dropout = config.dropout

        # ----- Text head -----
        self.text_proj = nn.Sequential(
            nn.Linear(D, config.text_hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(config.text_hidden_dim, K),
        )

        # ----- Additive macro heads -----
        self.macro_nets = nn.ModuleList([
            MacroSubNet(num_labels=K, hidden_dim=config.macro_hidden_dim)
            for _ in range(M)
        ])

        # ----- Country/Year embeddings -----
        self.country_emb = nn.Embedding(config.num_countries, config.country_emb_dim)
        self.country_head = nn.Linear(config.country_emb_dim, K)

        self.year_emb = nn.Embedding(config.num_years, config.year_emb_dim)
        self.year_head = nn.Linear(config.year_emb_dim, K)

        # ----- Structural context encoder -----
        self.macro_token = MacroTokenEncoder(
            d_model=config.ctx_dim,
            hidden=max(64, config.ctx_dim // 2),
            dropout=dropout,
        )
        self.country_to_ctx = nn.Sequential(
            nn.Linear(config.country_emb_dim, config.ctx_dim),
            nn.GELU(),
            nn.Dropout(dropout),
        )
        self.year_to_ctx = nn.Sequential(
            nn.Linear(config.year_emb_dim, config.ctx_dim),
            nn.GELU(),
            nn.Dropout(dropout),
        )

        enc_layer = nn.TransformerEncoderLayer(
            d_model=config.ctx_dim,
            nhead=config.ctx_heads,
            dim_feedforward=config.ctx_dim * 4,
            dropout=dropout,
            activation="gelu",
            batch_first=True,
            norm_first=True,
        )
        self.ctx_encoder = nn.TransformerEncoder(enc_layer, num_layers=config.ctx_depth)
        self.ctx_norm = nn.LayerNorm(config.ctx_dim)

        # ----- FiLM modulation -----
        self.ctx_to_gamma_beta = nn.Sequential(
            nn.Linear(config.ctx_dim, 2 * D),
            nn.Tanh(),
        )

        # ----- Explicit interaction -----
        self.ctx_to_text = nn.Linear(config.ctx_dim, D)
        self.interaction_head = nn.Sequential(
            nn.Linear(D, config.text_hidden_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(config.text_hidden_dim, K),
        )

        self.loss_fn = nn.CrossEntropyLoss()
        self.post_init()

    @classmethod
    def from_text_pretrained(
        cls,
        text_model_name_or_path: str,
        *,
        num_labels: int,
        num_macro: int,
        num_countries: int,
        num_years: int,
        **kwargs,
    ):
        text_pretrained_kwargs = kwargs.pop("text_pretrained_kwargs", None) or {}
        text_cfg = AutoConfig.from_pretrained(text_model_name_or_path)

        config = CausalInterpretableConfig(
            text_model_name_or_path=text_model_name_or_path,
            text_config=text_cfg.to_dict(),
            num_labels=num_labels,
            num_macro=num_macro,
            num_countries=num_countries,
            num_years=num_years,
            **kwargs,
        )

        model = cls(config)
        model.text_encoder = AutoModel.from_pretrained(
            text_model_name_or_path,
            config=text_cfg,
            **text_pretrained_kwargs,
        )
        return model

    def _encode_context(self, macro: torch.Tensor, country_id: torch.Tensor, year_id: torch.Tensor):
        country_vec = self.country_emb(country_id)
        year_vec = self.year_emb(year_id)

        macro_tokens = []
        for j in range(self.config.num_macro):
            xj = macro[:, j:j+1]
            macro_tokens.append(self.macro_token(xj))
        macro_tokens = torch.stack(macro_tokens, dim=1)

        c_tok = self.country_to_ctx(country_vec).unsqueeze(1)
        y_tok = self.year_to_ctx(year_vec).unsqueeze(1)
        tokens = torch.cat([macro_tokens, c_tok, y_tok], dim=1)

        tokens = self.ctx_encoder(tokens)
        ctx = self.ctx_norm(tokens.mean(dim=1))
        return ctx, country_vec, year_vec

    def forward(
        self,
        input_ids: torch.Tensor,
        attention_mask: Optional[torch.Tensor] = None,
        macro: Optional[torch.Tensor] = None,
        country_id: Optional[torch.Tensor] = None,
        year_id: Optional[torch.Tensor] = None,
        labels: Optional[torch.Tensor] = None,
        output_components: bool = False,
        **kwargs,
    ) -> CausalInterpretableOutput:
        if attention_mask is None:
            attention_mask = torch.ones_like(input_ids)
        if macro is None or country_id is None or year_id is None:
            raise ValueError("macro, country_id, and year_id must be provided.")

        ctx, country_vec, year_vec = self._encode_context(macro, country_id, year_id)

        text_out = self.text_encoder(input_ids=input_ids, attention_mask=attention_mask, **kwargs)
        cls_emb = text_out.last_hidden_state[:, 0, :]

        gamma_beta = self.ctx_to_gamma_beta(ctx)
        gamma, beta = gamma_beta.chunk(2, dim=-1)
        cls_film = cls_emb * (1.0 + gamma) + beta

        logits_text = self.text_proj(cls_film)

        macro_each = []
        for j, net in enumerate(self.macro_nets):
            macro_each.append(net(macro[:, j:j+1]))
        logits_macro_sum = torch.stack(macro_each, dim=0).sum(dim=0)

        logits_country = self.country_head(country_vec)
        logits_year = self.year_head(year_vec)

        ctx_in_text = self.ctx_to_text(ctx)
        logits_interaction = self.interaction_head(cls_emb * ctx_in_text)

        logits = logits_text + logits_macro_sum + logits_country + logits_year + logits_interaction

        loss = None
        if labels is not None:
            loss = self.loss_fn(logits, labels)

        if output_components:
            return CausalInterpretableOutput(
                loss=loss,
                logits=logits,
                logits_text=logits_text,
                logits_macro_sum=logits_macro_sum,
                logits_country=logits_country,
                logits_year=logits_year,
                logits_interaction=logits_interaction,
                logits_macro_each=tuple(macro_each),
            )

        return CausalInterpretableOutput(loss=loss, logits=logits)
