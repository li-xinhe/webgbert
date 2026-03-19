from __future__ import annotations

import json
import os
from pathlib import Path
import sys
import warnings

import numpy as np


def main() -> int:
    warnings.filterwarnings(
        "ignore",
        message="enable_nested_tensor is True, but self.use_nested_tensor is False",
    )

    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError as exc:
        print(json.dumps({"error": f"Invalid request payload: {exc}"}))
        return 1

    base_dir = Path(payload["base_dir"]).resolve()
    sys.path.insert(0, str(base_dir))

    try:
        import torch
        from transformers import AutoTokenizer

        from modeling_causal_interpretable import (
            CausalInterpretableForSequenceClassification,
        )
    except Exception as exc:
        print(json.dumps({"error": f"Failed to import runtime libraries: {exc}"}))
        return 1

    try:
        os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
        label_classes = payload["label_classes"]
        macro_cols = payload["macro_cols"]
        standardized_values = payload["standardized_values"]
        top_k = int(payload["top_k"])
        num_countries = int(payload["num_countries"])
        num_years = int(payload["num_years"])
        text_model_name_or_path = payload.get("text_model_name_or_path", "bert-base-multilingual-cased")
        torch_num_threads = int(payload.get("torch_num_threads", 1))

        torch.set_num_threads(torch_num_threads)
        if hasattr(torch, "set_num_interop_threads"):
            torch.set_num_interop_threads(1)

        model_path = Path(payload["model_path"])
        if not model_path.exists():
            model_repo_id = payload.get("model_repo_id") or ""
            model_filename = payload.get("model_filename") or "causal_nam_best.pt"
            hf_token = payload.get("hf_token") or None
            if not model_repo_id:
                raise FileNotFoundError(
                    f"Model file not found at {model_path} and MODEL_REPO_ID is not configured."
                )

            from huggingface_hub import hf_hub_download

            model_path = Path(
                hf_hub_download(
                    repo_id=model_repo_id,
                    filename=model_filename,
                    token=hf_token,
                )
            )

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = CausalInterpretableForSequenceClassification.from_text_pretrained(
            text_model_name_or_path,
            num_labels=len(label_classes),
            num_macro=len(macro_cols),
            num_countries=num_countries,
            num_years=num_years,
            text_pretrained_kwargs={"low_cpu_mem_usage": True},
        ).to(device)

        load_kwargs = {"map_location": device}
        if "weights_only" in torch.load.__code__.co_varnames:
            load_kwargs["weights_only"] = True
        if "mmap" in torch.load.__code__.co_varnames:
            load_kwargs["mmap"] = True
        state_dict = torch.load(model_path, **load_kwargs)
        model.load_state_dict(state_dict)
        model.eval()
        model.requires_grad_(False)

        tokenizer = AutoTokenizer.from_pretrained(text_model_name_or_path)
        encoded = tokenizer(
            payload["text"],
            truncation=True,
            max_length=128,
            padding="max_length",
            return_tensors="pt",
        )

        with torch.inference_mode():
            output = model(
                input_ids=encoded["input_ids"].to(device),
                attention_mask=encoded["attention_mask"].to(device),
                macro=torch.tensor([standardized_values], dtype=torch.float32, device=device),
                country_id=torch.tensor([int(payload["country_id"])], dtype=torch.long, device=device),
                year_id=torch.tensor([int(payload["year_id"])], dtype=torch.long, device=device),
            )
            probs = torch.softmax(output.logits, dim=-1)[0].detach().cpu().numpy()

        top_indices = np.argsort(probs)[::-1][:top_k]
        predictions = [
            {
                "rank": rank + 1,
                "label": str(label_classes[idx]),
                "probability": float(probs[idx]),
            }
            for rank, idx in enumerate(top_indices)
        ]
        print(json.dumps({"predictions": predictions}, ensure_ascii=False))
        return 0
    except Exception as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
