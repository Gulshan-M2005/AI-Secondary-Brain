import os
from typing import Any

import requests

BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
MODEL = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
FALLBACK_MODEL = os.getenv("OLLAMA_FALLBACK_MODEL", "mistral")


def generate(prompt: str, system: str = "", model: str | None = None) -> str:
    payload: dict[str, Any] = {
        "model": model or MODEL,
        "prompt": f"{system}\n\n{prompt}".strip(),
        "stream": False,
    }
    try:
        response = requests.post(f"{BASE_URL}/api/generate", json=payload, timeout=90)
        if response.status_code == 404 and payload["model"] != FALLBACK_MODEL:
            payload["model"] = FALLBACK_MODEL
            response = requests.post(f"{BASE_URL}/api/generate", json=payload, timeout=90)
        response.raise_for_status()
        return response.json().get("response", "").strip()
    except Exception as exc:
        print(f"Ollama generation unavailable: {exc}")
        return ""
