import os
from pathlib import Path

WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")


def transcribe_audio(audio_path: str) -> dict:
    path = Path(audio_path)
    if not path.exists():
        return {"text": "", "confidence": 0.0, "status": "missing", "segments": []}
    try:
        from faster_whisper import WhisperModel

        model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
        segments, info = model.transcribe(str(path), beam_size=5)
        collected = []
        chunks = []
        for index, segment in enumerate(segments):
            text = segment.text.strip()
            collected.append(text)
            chunks.append(
                {
                    "index": index,
                    "text": text,
                    "start": float(segment.start),
                    "end": float(segment.end),
                }
            )
        return {
            "text": " ".join(collected).strip(),
            "confidence": 0.85 if collected else 0.0,
            "status": "completed",
            "language": getattr(info, "language", ""),
            "segments": chunks,
        }
    except Exception as exc:
        return {
            "text": "",
            "confidence": 0.0,
            "status": f"transcription_unavailable: {exc}",
            "segments": [],
        }
