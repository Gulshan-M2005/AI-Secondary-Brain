import json
import re

from services.ollama_service import generate


SUMMARY_KEYS = [
    "short_summary",
    "detailed_summary",
    "key_points",
    "decisions",
    "action_items",
    "deadlines",
    "advice",
    "risks",
    "opportunities",
    "people",
    "topics",
]


def _fallback_summary(text: str) -> dict:
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    short = " ".join(sentences[:2]) if text else "No transcript text is available yet."
    return {
        "short_summary": short,
        "detailed_summary": text[:1200] or short,
        "key_points": sentences[:6] if text else [],
        "decisions": [],
        "action_items": [],
        "deadlines": [],
        "advice": [],
        "risks": [],
        "opportunities": [],
        "people": [],
        "topics": [],
    }


def generate_summary(text: str) -> dict:
    if not text.strip():
        return _fallback_summary(text)
    prompt = f"""
Analyze this transcript for a private local memory app. Return valid JSON only with these keys:
{", ".join(SUMMARY_KEYS)}.
Use arrays for list fields. Transcript:

{text[:9000]}
"""
    raw = generate(prompt, "You extract structured meeting memory from transcripts.")
    try:
        start = raw.find("{")
        end = raw.rfind("}") + 1
        data = json.loads(raw[start:end])
        return {key: data.get(key, [] if key not in ["short_summary", "detailed_summary"] else "") for key in SUMMARY_KEYS}
    except Exception:
        return _fallback_summary(text)
