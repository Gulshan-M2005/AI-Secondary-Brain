import json
import math
import os
from array import array

import requests

BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")


def pack_vector(vector: list[float]) -> bytes:
    return array("f", vector).tobytes()


def unpack_vector(blob: bytes) -> list[float]:
    values = array("f")
    values.frombytes(blob)
    return list(values)


def embed_text(text: str) -> list[float]:
    try:
        response = requests.post(
            f"{BASE_URL}/api/embeddings",
            json={"model": EMBED_MODEL, "prompt": text},
            timeout=45,
        )
        response.raise_for_status()
        return response.json().get("embedding", [])
    except Exception:
        # Deterministic local fallback: keyword hash vector, useful until Ollama embeddings are pulled.
        vector = [0.0] * 384
        for token in text.lower().split():
            vector[hash(token) % len(vector)] += 1.0
        norm = math.sqrt(sum(v * v for v in vector)) or 1.0
        return [v / norm for v in vector]


def cosine(a: list[float], b: list[float]) -> float:
    if not a or not b:
        return 0.0
    size = min(len(a), len(b))
    dot = sum(a[i] * b[i] for i in range(size))
    na = math.sqrt(sum(a[i] * a[i] for i in range(size))) or 1.0
    nb = math.sqrt(sum(b[i] * b[i] for i in range(size))) or 1.0
    return dot / (na * nb)


def vector_meta(vector: list[float]) -> str:
    return json.dumps({"dimensions": len(vector), "model": EMBED_MODEL})
