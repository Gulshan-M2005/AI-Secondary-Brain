from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

AUDIO_DIR = Path(__file__).resolve().parents[1] / "storage" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)


def save_upload(file: UploadFile) -> dict:
    suffix = Path(file.filename or "recording.webm").suffix or ".webm"
    name = f"{uuid4().hex}{suffix}"
    path = AUDIO_DIR / name
    with path.open("wb") as handle:
        handle.write(file.file.read())
    return {
        "file_path": str(path),
        "file_name": name,
        "format": suffix.lstrip(".").lower(),
        "size_bytes": path.stat().st_size,
    }
