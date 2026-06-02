# AI Secondary Brain

AI Secondary Brain is a private, local-first memory app for recorded conversations. It records audio in the browser, stores audio and transcripts locally, uses Faster-Whisper for local speech-to-text, uses Ollama for summaries and Q&A, and keeps all memory data in SQLite.

## Features

- Consent-gated audio recording with pause, resume, stop, timer, and live waveform.
- Local audio storage in `backend/storage/audio/`.
- Local transcription through Faster-Whisper.
- Ollama-powered summaries, decisions, deadlines, advice, risks, opportunities, topics, and action items.
- Local memory engine with transcript chunks, local embeddings, keyword search, semantic search, and hybrid search.
- Q&A that answers from saved transcript sections and returns source references.
- Dashboard with activity, totals, topic distribution, and recent conversations.
- Action item tracker with completion status.
- PDF, TXT, and DOCX report generation.
- Responsive React interface with dark mode.

## Privacy Design

Recording never starts automatically. The recorder displays:

> Please ensure you have permission to record this conversation and comply with local laws.

Audio, transcripts, summaries, embeddings, reports, and Q&A history remain on your computer. The app does not call OpenAI, paid APIs, cloud storage, or external vector databases. Ollama is expected to run locally at `http://localhost:11434`.

## Architecture

```text
frontend/ React 18 + Vite + Tailwind + Framer Motion + Recharts
backend/  FastAPI + SQLite + SQLAlchemy + Faster-Whisper + Ollama
```

Important backend tables include `conversations`, `audio_files`, `transcripts`, `transcript_chunks`, `embeddings`, `summaries`, `action_items`, `qa_history`, `reports`, and `settings`.

## Ollama Setup

Install Ollama, then pull the local models:

```bash
ollama pull llama3.1:8b
ollama pull nomic-embed-text
```

Optional fallback model:

```bash
ollama pull mistral
```

## Run

Windows:

```bat
start.bat
```

macOS/Linux/Git Bash:

```bash
./start.sh
```

Manual backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8001
```

Manual frontend:

```bash
cd frontend
npm install
$env:VITE_API_BASE="http://127.0.0.1:8001"
npm run dev
```

## Local Paths

- Backend URL: `http://127.0.0.1:8001`
- Frontend URL: `http://127.0.0.1:5173`
- Database: `backend/secondary_brain.db`
- Audio storage: `backend/storage/audio/`
- Reports: `backend/storage/reports/`

## Troubleshooting

- If summaries say Ollama is unavailable, start Ollama and pull `llama3.1:8b`.
- If semantic search uses weak results, pull `nomic-embed-text`; the app has a deterministic local fallback vectorizer for development.
- Faster-Whisper downloads its selected model on first use. Set `WHISPER_MODEL=base` or another local model name before starting the backend.
- Browser microphone recording requires a secure context. `localhost` and `127.0.0.1` are accepted by modern browsers.

## Future Enhancements

- Speaker diarization.
- Background transcription queue.
- Rich transcript editor with timestamp correction.
- Calendar import and automatic meeting metadata.
- Local backup/export bundle.
