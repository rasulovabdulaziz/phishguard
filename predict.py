"""Prediction helper used by Flask routes and CLI testing."""

from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from feature_extraction import (
    extract_features,
    is_valid_url,
    normalize_url,
    summarize_url_analysis,
)


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "phishing_model.pkl"


def _apply_heuristic_override(features: dict, analysis: dict, ml_prediction: str) -> tuple[str, str]:
    """
    Add a simple rule-based safety net on top of the ML model.

    This helps catch obvious phishing-style URLs even when a small training
    dataset does not generalize well enough.
    """
    matched_keywords = analysis["matched_keywords"]
    matched_brands = analysis["matched_brands"]

    strong_signals = 0
    if features["uses_ip_address"]:
        strong_signals += 2
    if features["has_at_symbol"]:
        strong_signals += 2
    if analysis["host_contains_protocol_word"]:
        strong_signals += 2
    if len(matched_keywords) >= 2:
        strong_signals += 1
    if matched_brands and matched_keywords:
        strong_signals += 2
    if features["hyphen_count"] >= 2:
        strong_signals += 1
    if features["subdomain_count"] >= 2:
        strong_signals += 1
    if not features["uses_https"]:
        strong_signals += 1

    if ml_prediction == "Phishing":
        return ml_prediction, "machine_learning"

    if strong_signals >= 3:
        return "Phishing", "heuristic_override"

    return ml_prediction, "machine_learning"


def _load_saved_bundle() -> dict:
    """Load the saved model package from disk."""
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model file not found at {MODEL_PATH}. Run train_model.py first."
        )
    return joblib.load(MODEL_PATH)


def predict_url(url: str) -> dict:
    """
    Predict whether a URL is safe or phishing.

    Returns a small structured dictionary that the Flask backend can send
    directly to the frontend.
    """
    normalized_url = normalize_url(url)
    if not is_valid_url(normalized_url):
        raise ValueError("Please enter a valid URL.")

    bundle = _load_saved_bundle()
    model = bundle["model"]
    feature_names = bundle["feature_names"]

    features = extract_features(normalized_url)
    feature_frame = pd.DataFrame([features], columns=feature_names)

    predicted_label = int(model.predict(feature_frame)[0])
    ml_prediction = "Phishing" if predicted_label == 1 else "Safe"

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(feature_frame)[0]
        confidence = float(np.max(probabilities) * 100)
    else:
        confidence = 100.0

    analysis = summarize_url_analysis(normalized_url)
    prediction_text, decision_source = _apply_heuristic_override(
        features,
        analysis,
        ml_prediction,
    )
    is_safe = prediction_text == "Safe"

    if decision_source == "heuristic_override":
        confidence = max(confidence, 85.0)

    return {
        "prediction": prediction_text,
        "confidence": round(confidence, 2),
        "normalized_url": normalized_url,
        "phishing_type": (
            "Legitimate or low-risk pattern"
            if is_safe
            else analysis["phishing_type"]
        ),
        "summary": (
            "This URL looks safe because no strong phishing indicators were detected."
            if is_safe
            else "This URL looks suspicious because it matches common phishing patterns and heuristic checks."
        ),
        "findings": analysis["findings"],
        "matched_keywords": analysis["matched_keywords"],
        "matched_brands": analysis["matched_brands"],
        "decision_source": decision_source,
    }


if __name__ == "__main__":
    test_url = "https://secure-login-example.com/verify-account"
    try:
        result = predict_url(test_url)
        print(f"URL        : {test_url}")
        print(f"Prediction : {result['prediction']}")
        print(f"Confidence : {result['confidence']}%")
    except Exception as error:
        print(f"Error: {error}")
