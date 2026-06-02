#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "AI Secondary Brain - local runner"
if curl -fsS http://localhost:11434/api/tags >/dev/null 2>&1; then
  echo "Ollama is reachable."
else
  echo "Ollama is not reachable. Start Ollama and run:"
  echo "  ollama pull llama3.1:8b"
  echo "  ollama pull nomic-embed-text"
fi

if [ ! -d backend/.venv ]; then
  python -m venv backend/.venv
fi
source backend/.venv/bin/activate
pip install -r backend/requirements.txt

if [ ! -d frontend/node_modules ]; then
  (cd frontend && npm install)
fi

(cd backend && uvicorn main:app --host 127.0.0.1 --port 8001) &
(cd frontend && VITE_API_BASE=http://127.0.0.1:8001 npm run dev) &

echo "Backend:  http://127.0.0.1:8001"
echo "Frontend: http://127.0.0.1:5173"
wait
