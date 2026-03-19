from __future__ import annotations

from dataclasses import dataclass
import json
import os
from pathlib import Path
import subprocess
import sys
from typing import Any
import warnings

import joblib
import pandas as pd


MODEL_COUNTRY_TO_WB = {
    "Bosnia-Herzegovina": "Bosnia and Herzegovina",
    "Czech Republic": "Czechia",
    "Russia": "Russian Federation",
    "Slovakia": "Slovak Republic",
    "South Korea": "Korea, Rep.",
    "Turkey": "Turkiye",
}

WB_COUNTRY_TO_MODEL = {value: key for key, value in MODEL_COUNTRY_TO_WB.items()}

MACRO_SOURCES = {
    "battle_value": "add/battle/API_VC.BTL.DETH_DS2_en_csv_v2_9816.csv",
    "gdp_value": "add/gdp/API_NY.GDP.MKTP.KD.ZG_DS2_en_csv_v2_2509.csv",
    "trade_value": "add/trade/API_NE.TRD.GNFS.ZS_DS2_en_csv_v2_2650.csv",
    "debt_value": "add/debt/API_GC.DOD.TOTL.GD.ZS_DS2_en_csv_v2_2484.csv",
    "inflation_value": "add/inflation/API_FP.CPI.TOTL.ZG_DS2_en_csv_v2_2479.csv",
    "unemployment_value": "add/unemployment/API_SL.UEM.TOTL.ZS_DS2_en_csv_v2_2821.csv",
}


@dataclass
class MacroLookupResult:
    country: str
    year: int
    raw_values: dict[str, float]
    standardized_values: list[float]
    raw_sources: dict[str, str]


class ManifestoInferenceService:
    def __init__(self, base_dir: str | Path):
        self.base_dir = Path(base_dir).resolve()
        self.meta_path = self.base_dir / "preprocess_meta.joblib"
        self.model_path = self._resolve_local_model_path()
        self.model_repo_id = os.environ.get("MODEL_REPO_ID", "").strip()
        self.model_filename = os.environ.get("MODEL_FILENAME", "causal_nam_best.pt").strip()
        self.hf_token = os.environ.get("HF_TOKEN", "").strip() or None
        self.text_model_name_or_path = os.environ.get(
            "TEXT_MODEL_NAME_OR_PATH",
            "bert-base-multilingual-cased",
        ).strip()
        self.torch_num_threads = int(os.environ.get("TORCH_NUM_THREADS", "1"))

        self.meta = self._load_meta()
        self.country_classes = [str(v) for v in self.meta["country_le"].classes_]
        self.year_classes = sorted(int(v) for v in self.meta["year_le"].classes_)
        self.label_classes = [str(v) for v in self.meta["cat_le"].classes_]
        self.macro_cols = list(self.meta["macro_cols"])
        self.macro_means = {
            key: float(value) for key, value in self.meta["macro_means"].to_dict().items()
        }
        self.macro_stds = {
            key: float(value) if float(value) != 0 else 1.0
            for key, value in self.meta["macro_stds"].to_dict().items()
        }

        self.macro_frame = self._load_macro_frame()
        self.available_years = self._build_available_years()

    def _resolve_local_model_path(self) -> Path:
        configured = os.environ.get("MODEL_PATH", "").strip()
        if configured:
            path = Path(configured)
            if not path.is_absolute():
                path = self.base_dir / path
            return path.resolve()
        return (self.base_dir / "causal_nam_best.pt").resolve()

    def _load_meta(self) -> dict[str, Any]:
        warnings.filterwarnings(
            "ignore",
            message="Trying to unpickle estimator LabelEncoder",
        )
        return joblib.load(self.meta_path)

    def _load_world_bank_csv(self, macro_name: str, relative_path: str) -> pd.DataFrame:
        csv_path = self.base_dir / relative_path
        df = pd.read_csv(csv_path, skiprows=4)
        year_cols = [col for col in df.columns if str(col).isdigit()]
        df = df[["Country Name", *year_cols]].copy()
        df["Country Name"] = df["Country Name"].replace(WB_COUNTRY_TO_MODEL)

        long_df = df.melt(
            id_vars="Country Name",
            value_vars=year_cols,
            var_name="year",
            value_name=macro_name,
        )
        long_df = long_df.rename(columns={"Country Name": "country"})
        long_df["year"] = long_df["year"].astype(int)
        long_df[macro_name] = pd.to_numeric(long_df[macro_name], errors="coerce")
        long_df = long_df[long_df["country"].isin(self.country_classes)].copy()
        return long_df

    def _load_macro_frame(self) -> pd.DataFrame:
        merged: pd.DataFrame | None = None

        for macro_name, relative_path in MACRO_SOURCES.items():
            macro_df = self._load_world_bank_csv(macro_name, relative_path)
            if merged is None:
                merged = macro_df
            else:
                merged = merged.merge(macro_df, on=["country", "year"], how="outer")

        if merged is None:
            raise RuntimeError("No macro data loaded from add directory.")

        merged = merged.sort_values(["country", "year"]).reset_index(drop=True)
        return merged

    def _build_available_years(self) -> dict[str, list[int]]:
        valid_years = set(self.year_classes)
        by_country: dict[str, list[int]] = {}

        for country in self.country_classes:
            country_df = self.macro_frame[self.macro_frame["country"] == country]
            years = sorted(
                int(y) for y in country_df["year"].dropna().astype(int).unique() if int(y) in valid_years
            )
            by_country[country] = years

        return by_country

    def list_countries(self) -> list[str]:
        return [country for country in self.country_classes if self.available_years.get(country)]

    def list_years(self, country: str) -> list[int]:
        self._validate_country(country)
        years = self.available_years.get(country, [])
        if not years:
            raise ValueError(f"{country} has no supported years in add data.")
        return years

    def runtime_config(self) -> dict[str, Any]:
        return {
            "localModelPath": str(self.model_path),
            "localModelExists": self.model_path.exists(),
            "modelRepoId": self.model_repo_id or None,
            "modelFilename": self.model_filename,
            "textModelNameOrPath": self.text_model_name_or_path,
            "torchNumThreads": self.torch_num_threads,
        }

    def _validate_country(self, country: str) -> None:
        if country not in self.country_classes:
            raise ValueError(f"Unsupported country: {country}")

    def _validate_year(self, year: int) -> None:
        if year not in self.year_classes:
            raise ValueError(f"Unsupported year: {year}")

    def get_macro_values(self, country: str, year: int) -> MacroLookupResult:
        self._validate_country(country)
        self._validate_year(year)

        row = self.macro_frame[
            (self.macro_frame["country"] == country) & (self.macro_frame["year"] == year)
        ]

        raw_values: dict[str, float] = {}
        raw_sources: dict[str, str] = {}

        if row.empty:
            for macro_name in self.macro_cols:
                raw_values[macro_name] = 0.0
                raw_sources[macro_name] = "missing-year-filled-zero"
        else:
            row_data = row.iloc[0]
            for macro_name in self.macro_cols:
                value = row_data.get(macro_name)
                if pd.isna(value):
                    raw_values[macro_name] = 0.0
                    raw_sources[macro_name] = "dataset-missing-filled-zero"
                else:
                    raw_values[macro_name] = float(value)
                    raw_sources[macro_name] = "dataset"

        standardized_values = [
            (raw_values[macro_name] - self.macro_means[macro_name]) / self.macro_stds[macro_name]
            for macro_name in self.macro_cols
        ]

        return MacroLookupResult(
            country=country,
            year=year,
            raw_values=raw_values,
            standardized_values=standardized_values,
            raw_sources=raw_sources,
        )

    def _run_model_subprocess(
        self,
        *,
        text: str,
        country: str,
        year: int,
        country_id: int,
        year_id: int,
        standardized_values: list[float],
        top_k: int,
    ) -> list[dict[str, Any]]:
        worker_path = self.base_dir / "model_worker.py"
        payload = {
            "base_dir": str(self.base_dir),
            "text": text,
            "country": country,
            "year": year,
            "country_id": country_id,
            "year_id": year_id,
            "label_classes": self.label_classes,
            "macro_cols": self.macro_cols,
            "num_countries": len(self.country_classes),
            "num_years": len(self.year_classes),
            "model_path": str(self.model_path),
            "model_repo_id": self.model_repo_id,
            "model_filename": self.model_filename,
            "hf_token": self.hf_token,
            "text_model_name_or_path": self.text_model_name_or_path,
            "torch_num_threads": self.torch_num_threads,
            "standardized_values": standardized_values,
            "top_k": top_k,
        }

        proc = subprocess.run(
            [sys.executable, str(worker_path)],
            input=json.dumps(payload),
            capture_output=True,
            text=True,
            cwd=self.base_dir,
        )

        if proc.returncode != 0:
            stderr = (proc.stderr or "").strip()
            stdout = (proc.stdout or "").strip()
            detail = stderr or stdout or "Unknown model runtime failure."
            raise RuntimeError(
                "Model runtime is not ready. "
                f"Worker process failed with: {detail}"
            )

        try:
            body = json.loads(proc.stdout)
        except json.JSONDecodeError as exc:
            raise RuntimeError("Model worker returned invalid JSON.") from exc

        if "error" in body:
            raise RuntimeError(str(body["error"]))

        return body["predictions"]

    def predict(self, text: str, country: str, year: int, top_k: int = 5) -> dict[str, Any]:
        text = (text or "").strip()
        if not text:
            raise ValueError("Text is required.")

        self._validate_country(country)
        self._validate_year(year)

        macro_lookup = self.get_macro_values(country, year)

        country_id = int(self.meta["country_le"].transform([country])[0])
        year_id = int(self.meta["year_le"].transform([year])[0])
        predictions = self._run_model_subprocess(
            text=text,
            country=country,
            year=year,
            country_id=country_id,
            year_id=year_id,
            standardized_values=macro_lookup.standardized_values,
            top_k=top_k,
        )

        macro_payload = {
            macro_name: {
                "raw": macro_lookup.raw_values[macro_name],
                "standardized": macro_lookup.standardized_values[i],
                "source": macro_lookup.raw_sources[macro_name],
            }
            for i, macro_name in enumerate(self.macro_cols)
        }

        return {
            "text": text,
            "country": country,
            "year": year,
            "predictions": predictions,
            "macro_values": macro_payload,
        }
