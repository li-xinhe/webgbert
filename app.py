from __future__ import annotations

import os
from pathlib import Path

from flask import Flask, jsonify, request

from inference_service import ManifestoInferenceService


BASE_DIR = Path(__file__).resolve().parent
app = Flask(__name__)
service = ManifestoInferenceService(BASE_DIR)


def _allowed_cors_origins() -> set[str]:
    raw = os.environ.get("CORS_ALLOW_ORIGINS", "*").strip()
    if not raw:
        return {"*"}
    return {origin.strip() for origin in raw.split(",") if origin.strip()}


def _cors_origin_for_request() -> str:
    allowed = _allowed_cors_origins()
    request_origin = request.headers.get("Origin", "").strip()
    if "*" in allowed:
        return "*" if not request_origin else request_origin
    if request_origin in allowed:
        return request_origin
    return ""


@app.after_request
def add_cors_headers(response):
    allowed_origin = _cors_origin_for_request()
    if allowed_origin:
        response.headers["Access-Control-Allow-Origin"] = allowed_origin
        response.headers["Vary"] = "Origin"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.get("/")
def index():
    runtime = service.runtime_config()
    return jsonify(
        {
            "service": "manifesto-model-api",
            "status": "ok",
            "health": "/api/health",
            "options": "/api/options",
            "predict": "/api/predict",
            "localModelExists": runtime["localModelExists"],
            "modelRepoId": runtime["modelRepoId"],
        }
    )


@app.route("/health", methods=["GET", "OPTIONS"])
@app.route("/api/health", methods=["GET", "OPTIONS"])
def health():
    runtime = service.runtime_config()
    return jsonify(
        {
            "status": "ok",
            "countries": len(service.list_countries()),
            "labels": len(service.label_classes),
            "localModelExists": runtime["localModelExists"],
            "modelRepoId": runtime["modelRepoId"],
        }
    )


@app.route("/api/options", methods=["GET", "OPTIONS"])
def api_options():
    countries = service.list_countries()
    default_country = "Japan" if "Japan" in countries else countries[0]
    return jsonify(
        {
            "countries": countries,
            "yearsByCountry": service.available_years,
            "defaultCountry": default_country,
        }
    )


@app.route("/api/predict", methods=["POST", "OPTIONS"])
def api_predict():
    if request.method == "OPTIONS":
        return ("", 204)

    payload = request.get_json(silent=True) or {}
    text = payload.get("text", "")
    country = payload.get("country", "")
    year = payload.get("year")
    top_k = int(payload.get("top_k", 5))

    try:
        year = int(year)
    except (TypeError, ValueError):
        return jsonify({"error": "Year must be an integer."}), 400

    try:
        result = service.predict(text=text, country=country, year=year, top_k=top_k)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 503

    return jsonify(result)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8000"))
    debug = os.environ.get("FLASK_DEBUG", "").lower() in {"1", "true", "yes"}
    app.run(host="0.0.0.0", port=port, debug=debug)
