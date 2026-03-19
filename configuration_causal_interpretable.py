from typing import Optional, Dict, Any
from transformers import PretrainedConfig


class CausalInterpretableConfig(PretrainedConfig):
    model_type = "causal_interpretable"

    def __init__(
        self,
        # text backbone
        text_model_name_or_path: str = "bert-base-multilingual-cased",
        text_config: Optional[Dict[str, Any]] = None,

        # label space + structured inputs
        num_labels: int = 56,
        num_macro: int = 6,
        num_countries: int = 50,
        num_years: int = 100,

        # heads and context encoder
        text_hidden_dim: int = 256,
        macro_hidden_dim: int = 16,
        country_emb_dim: int = 16,
        year_emb_dim: int = 16,

        ctx_dim: int = 128,
        ctx_depth: int = 2,
        ctx_heads: int = 4,
        dropout: float = 0.1,

        problem_type: Optional[str] = None,
        **kwargs,
    ):
        super().__init__(**kwargs)

        self.text_model_name_or_path = text_model_name_or_path
        self.text_config = text_config

        self.num_labels = num_labels
        self.num_macro = num_macro
        self.num_countries = num_countries
        self.num_years = num_years

        self.text_hidden_dim = text_hidden_dim
        self.macro_hidden_dim = macro_hidden_dim
        self.country_emb_dim = country_emb_dim
        self.year_emb_dim = year_emb_dim

        self.ctx_dim = ctx_dim
        self.ctx_depth = ctx_depth
        self.ctx_heads = ctx_heads
        self.dropout = dropout

        self.problem_type = problem_type

