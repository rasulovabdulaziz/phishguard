from http.server import BaseHTTPRequestHandler
import json

from feature_extraction import is_valid_url, normalize_url
from predict import predict_url


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status_code: int, payload: dict) -> None:
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode("utf-8"))

    def do_OPTIONS(self):
        self._send_json(200, {"success": True})

    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length) if content_length > 0 else b"{}"
            data = json.loads(raw_body.decode("utf-8") or "{}")

            url = str(data.get("url", "")).strip()
            if not url:
                self._send_json(400, {"success": False, "error": "Please enter a URL."})
                return

            normalized_url = normalize_url(url)
            if not is_valid_url(normalized_url):
                self._send_json(400, {"success": False, "error": "Please enter a valid URL."})
                return

            result = predict_url(normalized_url)
            is_safe = result["prediction"] == "Safe"

            self._send_json(
                200,
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
                },
            )
        except ValueError as error:
            self._send_json(400, {"success": False, "error": str(error)})
        except FileNotFoundError as error:
            self._send_json(500, {"success": False, "error": str(error)})
        except Exception:
            self._send_json(
                500,
                {
                    "success": False,
                    "error": "An unexpected error occurred while processing the request.",
                },
            )
