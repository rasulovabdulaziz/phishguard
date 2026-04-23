"""Utility functions for phishing URL feature extraction."""

from __future__ import annotations

import ipaddress
import re
from typing import Dict, List
from urllib.parse import urlparse

import pandas as pd


SUSPICIOUS_KEYWORDS = [
    "login",
    "verify",
    "secure",
    "bank",
    "account",
    "update",
    "confirm",
    "signin",
]

BRAND_KEYWORDS = [
    "paypal",
    "apple",
    "google",
    "microsoft",
    "amazon",
    "facebook",
    "instagram",
    "netflix",
    "telegram",
    "whatsapp",
]


def normalize_url(url: str) -> str:
    """Trim spaces, undo common defanging, and add a scheme if missing."""
    cleaned = (url or "").strip()
    cleaned = cleaned.replace("[.]", ".").replace("(.)", ".")
    cleaned = cleaned.replace("hxxp://", "http://").replace("hxxps://", "https://")
    cleaned = cleaned.replace("[:]", ":").replace("[://]", "://")
    if cleaned and "://" not in cleaned:
        cleaned = f"http://{cleaned}"
    return cleaned


def is_valid_url(url: str) -> bool:
    """Basic URL validation for backend input handling."""
    normalized = normalize_url(url)
    if not normalized:
        return False

    try:
        parsed = urlparse(normalized)
    except Exception:
        return False

    if parsed.scheme not in {"http", "https"}:
        return False

    if not parsed.netloc:
        return False

    # Host must contain a valid-looking domain or IP address.
    host = parsed.netloc.split("@")[-1].split(":")[0].strip("[]").lower()
    if not host:
        return False

    if _looks_like_ip_address(host):
        return True

    if "." not in host:
        return False

    allowed = re.compile(r"^(?!-)[a-z0-9-]{1,63}(?<!-)$", re.IGNORECASE)
    return all(allowed.match(label) for label in host.split("."))


def _looks_like_ip_address(host: str) -> bool:
    """Return True when host is a valid IPv4 or IPv6 address."""
    try:
        ipaddress.ip_address(host)
        return True
    except ValueError:
        return False


def _count_suspicious_keywords(url: str) -> int:
    lowered = url.lower()
    return sum(1 for keyword in SUSPICIOUS_KEYWORDS if keyword in lowered)


def find_suspicious_keywords(url: str) -> List[str]:
    """Return suspicious keywords found in the provided URL."""
    lowered = url.lower()
    return [keyword for keyword in SUSPICIOUS_KEYWORDS if keyword in lowered]


def find_brand_keywords(url: str) -> List[str]:
    """Return brand names found in the provided URL."""
    lowered = url.lower()
    return [keyword for keyword in BRAND_KEYWORDS if keyword in lowered]


def extract_features(url: str) -> Dict[str, int]:
    """
    Extract numeric features from a URL.

    Invalid values are converted into a safe zero-heavy feature vector so the
    backend never crashes during training or prediction.
    """
    normalized = normalize_url(url)

    default_features = {
        "url_length": 0,
        "dot_count": 0,
        "hyphen_count": 0,
        "digit_count": 0,
        "slash_count": 0,
        "has_at_symbol": 0,
        "uses_https": 0,
        "suspicious_keyword_count": 0,
        "uses_ip_address": 0,
        "subdomain_count": 0,
    }

    if not normalized:
        return default_features

    try:
        parsed = urlparse(normalized)
        host = parsed.netloc.split("@")[-1].split(":")[0].strip("[]").lower()
    except Exception:
        return default_features

    host_parts = [part for part in host.split(".") if part]
    subdomain_count = max(len(host_parts) - 2, 0) if not _looks_like_ip_address(host) else 0

    return {
        "url_length": len(normalized),
        "dot_count": normalized.count("."),
        "hyphen_count": normalized.count("-"),
        "digit_count": sum(char.isdigit() for char in normalized),
        "slash_count": normalized.count("/"),
        "has_at_symbol": int("@" in normalized),
        "uses_https": int(parsed.scheme.lower() == "https"),
        "suspicious_keyword_count": _count_suspicious_keywords(normalized),
        "uses_ip_address": int(_looks_like_ip_address(host)),
        "subdomain_count": subdomain_count,
    }


def summarize_url_analysis(url: str) -> Dict[str, object]:
    """Build a small explanation block that can be shown in the frontend."""
    normalized = normalize_url(url)
    features = extract_features(normalized)

    try:
        parsed = urlparse(normalized)
        host = parsed.netloc.split("@")[-1].split(":")[0].strip("[]").lower()
    except Exception:
        host = ""

    matched_keywords = find_suspicious_keywords(normalized)
    matched_brands = find_brand_keywords(normalized)
    host_contains_protocol_word = "http" in host or "https" in host
    findings: List[str] = []

    if features["uses_ip_address"]:
        findings.append("The URL uses an IP address instead of a normal domain name.")
    if features["has_at_symbol"]:
        findings.append("The URL contains '@', which can hide the real destination.")
    if host_contains_protocol_word:
        findings.append("The domain contains words like 'http' or 'https', which is a common spoofing trick.")
    if features["suspicious_keyword_count"] > 0:
        findings.append(
            "Suspicious keywords were found: " + ", ".join(matched_keywords) + "."
        )
    if matched_brands:
        findings.append(
            "Known brand names were found in the domain: " + ", ".join(matched_brands) + "."
        )
    if features["hyphen_count"] >= 2:
        findings.append("The domain uses many hyphens, which is common in fake login pages.")
    if features["subdomain_count"] >= 2:
        findings.append("The URL has many subdomains, which can be used to imitate trusted brands.")
    if not features["uses_https"]:
        findings.append("The URL does not use HTTPS.")
    if features["url_length"] >= 75:
        findings.append("The URL is unusually long, which can be a phishing sign.")
    if not findings:
        findings.append("No strong phishing indicators were detected in the extracted features.")

    if features["uses_ip_address"] or features["has_at_symbol"]:
        phishing_type = "Obfuscated destination phishing"
    elif host_contains_protocol_word or (matched_keywords and matched_brands):
        phishing_type = "Brand spoofing and credential harvesting phishing"
    elif matched_keywords:
        phishing_type = "Credential harvesting or brand impersonation phishing"
    elif features["subdomain_count"] >= 2 or features["hyphen_count"] >= 2:
        phishing_type = "Domain spoofing phishing"
    else:
        phishing_type = "No strong phishing pattern detected"

    return {
        "normalized_url": normalized,
        "host": host,
        "matched_keywords": matched_keywords,
        "matched_brands": matched_brands,
        "host_contains_protocol_word": host_contains_protocol_word,
        "phishing_type": phishing_type,
        "findings": findings,
        "features": features,
    }


def extract_features_dataframe(urls: List[str]) -> pd.DataFrame:
    """Convert a list of URLs into a pandas DataFrame of extracted features."""
    rows = [extract_features(url) for url in urls]
    return pd.DataFrame(rows)
