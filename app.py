"""Flask backend for phishing URL detection and existing frontend delivery."""

from __future__ import annotations

from pathlib import Path

from flask import Flask, jsonify, render_template, request, send_from_directory

from feature_extraction import is_valid_url, normalize_url
from predict import predict_url


BASE_DIR = Path(__file__).resolve().parent
DIST_DIR = BASE_DIR / "dist"
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"

app = Flask(
    __name__,
    template_folder=str(TEMPLATES_DIR),
    static_folder=str(STATIC_DIR),
)


def _has_built_frontend() -> bool:
    """Return True when the existing React frontend has been built."""
    return (DIST_DIR / "index.html").exists()


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def frontend(path: str):
    """
    Serve the existing frontend.

    Priority:
    1. Built React app from dist/
    2. Simple Flask template fallback
    """
    if _has_built_frontend():
        requested_file = DIST_DIR / path
        if path and requested_file.exists() and requested_file.is_file():
            return send_from_directory(DIST_DIR, path)
        return send_from_directory(DIST_DIR, "index.html")

    # Fallback for cases where the React app has not been built yet.
    if path in {"", "index.html"}:
        return render_template("index.html")

    fallback_file = STATIC_DIR / path
    if fallback_file.exists() and fallback_file.is_file():
        return send_from_directory(STATIC_DIR, path)

    return render_template("index.html")


@app.route("/predict", methods=["POST"])
@app.route("/api/predict", methods=["POST"])
def predict():
    """Receive a URL from the frontend and return a JSON prediction."""
    try:
        data = request.get_json(silent=True) or {}
        url = str(data.get("url", "")).strip()

        if not url:
            return jsonify({"success": False, "error": "Please enter a URL."}), 400

        normalized_url = normalize_url(url)

        if not is_valid_url(normalized_url):
            return jsonify({"success": False, "error": "Please enter a valid URL."}), 400

        result = predict_url(normalized_url)
        is_safe = result["prediction"] == "Safe"

        return jsonify(
            {
                "success": True,
                "submitted_url": url,
                "normalized_url": result["normalized_url"],
                "prediction": result["prediction"],
                "confidence": result["confidence"],
                "phishing_type": result["phishing_type"],
                "summary": result["summary"],
                "findings": result["findings"],
                "matched_keywords": result["matched_keywords"],
                "matched_brands": result["matched_brands"],
                "decision_source": result["decision_source"],
                "message": (
                    "This URL appears safe based on analysis."
                    if is_safe
                    else "Warning: this URL appears suspicious and may be phishing."
                ),
            }
        )
    except ValueError as error:
        return jsonify({"success": False, "error": str(error)}), 400
    except FileNotFoundError as error:
        return jsonify({"success": False, "error": str(error)}), 500
    except Exception:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "An unexpected error occurred while processing the request.",
                }
            ),
            500,
        )


if __name__ == "__main__":
    app.run(debug=True)
