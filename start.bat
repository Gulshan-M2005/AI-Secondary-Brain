@echo off
setlocal
cd /d "%~dp0"

echo AI Secondary Brain - local runner
echo Checking Ollama at http://localhost:11434 ...
curl -s http://localhost:11434/api/tags >nul 2>&1
if errorlevel 1 (
  echo Ollama is not reachable. Start Ollama and run:
  echo   ollama pull llama3.1:8b
  echo   ollama pull nomic-embed-text
) else (
  echo Ollama is reachable.
)

if not exist backend\.venv (
  python -m venv backend\.venv
)
call backend\.venv\Scripts\activate
pip install -r backend\requirements.txt

if not exist frontend\node_modules (
  cd frontend
  npm install
  cd ..
)

start "AI Secondary Brain Backend" cmd /k "cd /d %cd%\backend && .venv\Scripts\activate && uvicorn main:app --host 127.0.0.1 --port 8001"
start "AI Secondary Brain Frontend" cmd /k "cd /d %cd%\frontend && set VITE_API_BASE=http://127.0.0.1:8001&& npm run dev"

echo Backend:  http://127.0.0.1:8001
echo Frontend: http://127.0.0.1:5173
endlocal
