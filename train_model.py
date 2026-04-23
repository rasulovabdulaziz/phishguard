"""Train and evaluate multiple phishing URL classifiers."""

from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

from feature_extraction import extract_features_dataframe


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "phishing_urls.csv"
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "phishing_model.pkl"


def evaluate_model(model, x_train, x_test, y_train, y_test) -> dict:
    """Fit a model and calculate common classification metrics."""
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)

    return {
        "model": model,
        "accuracy": accuracy_score(y_test, predictions),
        "precision": precision_score(y_test, predictions, zero_division=0),
        "recall": recall_score(y_test, predictions, zero_division=0),
        "f1_score": f1_score(y_test, predictions, zero_division=0),
        "confusion_matrix": confusion_matrix(y_test, predictions),
    }


def print_results(results: list[dict]) -> None:
    """Print results in a simple beginner-friendly format."""
    print("\nModel Comparison")
    print("=" * 70)
    for result in results:
        print(f"Model: {result['name']}")
        print(f"Accuracy : {result['accuracy']:.4f}")
        print(f"Precision: {result['precision']:.4f}")
        print(f"Recall   : {result['recall']:.4f}")
        print(f"F1-score : {result['f1_score']:.4f}")
        print("Confusion Matrix:")
        print(result["confusion_matrix"])
        print("-" * 70)


def main() -> None:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")

    dataset = pd.read_csv(DATA_PATH)
    required_columns = {"url", "label"}
    if not required_columns.issubset(dataset.columns):
        raise ValueError("Dataset must contain 'url' and 'label' columns.")

    dataset = dataset.dropna(subset=["url", "label"]).copy()
    dataset["url"] = dataset["url"].astype(str)
    dataset["label"] = dataset["label"].astype(int)

    x = extract_features_dataframe(dataset["url"].tolist())
    y = dataset["label"]

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.25,
        random_state=42,
        stratify=y,
    )

    models = [
        ("Logistic Regression", LogisticRegression(max_iter=1000, random_state=42)),
        ("Decision Tree", DecisionTreeClassifier(max_depth=6, random_state=42)),
        (
            "Random Forest",
            RandomForestClassifier(
                n_estimators=200,
                max_depth=8,
                random_state=42,
            ),
        ),
    ]

    results = []
    for name, model in models:
        result = evaluate_model(model, x_train, x_test, y_train, y_test)
        result["name"] = name
        results.append(result)

    print_results(results)

    # F1-score is a good simple choice here because phishing detection cares
    # about balancing false positives and false negatives.
    best_result = max(results, key=lambda item: item["f1_score"])

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "model_name": best_result["name"],
            "model": best_result["model"],
            "feature_names": list(x.columns),
        },
        MODEL_PATH,
    )

    print(f"Best model saved to: {MODEL_PATH}")
    print(f"Selected model      : {best_result['name']}")


if __name__ == "__main__":
    main()
