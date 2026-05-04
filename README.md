# YouTube Faceless Video Maker

A complete, production-ready personal tool for generating faceless YouTube videos for high-CPM niches.

## Features
- **20 High-CPM Niches**: Pre-configured templates, styles, and hooks.
- **AI AI Script Generation**: Uses Groq (llama-3.3-70b-versatile).
- **Free Media Assets**: Pollinations.ai (Images), Pexels, and Pixabay (Videos).
- **Free TTS**: Microsoft Edge Neural TTS.
- **Automated Video Rendering**: MoviePy & FFmpeg.
- **Custom Thumbnails**: Pillow-based auto-generation.

## Prerequisites
- Docker & Docker Compose
- Or locally: Python 3.11+, Node.js 18+, FFmpeg, PostgreSQL

## Setup Instructions (Docker)

1. Rename `.env.example` to `.env` and add your API keys:
   - Groq API Key (https://console.groq.com)
   - Pexels API Key (https://www.pexels.com/api/)
   - Pixabay API Key (https://pixabay.com/api/docs/)

2. Start the services:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend Studio: http://localhost:3000
   - Backend API: http://localhost:8000

## Setup Instructions (Local without Docker)

### System Requirements
- **Windows**: Install [FFmpeg](https://ffmpeg.org/download.html) and add to PATH. Install PostgreSQL.
- **Mac**: `brew install ffmpeg postgresql`
- **Linux**: `sudo apt update && sudo apt install ffmpeg postgresql`

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
npm install
npm run dev
```

All rendered files correctly drop into the `./outputs/videos` and `./outputs/thumbnails` folders.
