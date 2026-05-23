# RealTalk 🛡️
> *Speak up. Stay safe.*

A safe, anonymous web platform for students aged 11–15 to report peer pressure, vaping, smoking, and school violence — with an AI companion for guidance and real HBSC research data visualizations.

---

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React + Vite + Tailwind |
| Backend   | FastAPI (Python)        |
| Database  | PostgreSQL              |
| AI        | Claude API (Anthropic)  |
| Proxy     | Nginx                   |
| Container | Docker + Docker Compose |

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/realtalk.git
cd realtalk
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY and a strong SECRET_KEY
```

### 3. Run with Docker
```bash
docker compose up --build
```

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Via Nginx: http://localhost:80

---

## Project Structure

```
realtalk/
├── frontend/               # React + Vite app
│   └── src/
│       ├── pages/          # Home, Chat, Report, Stats, Awareness, Journal
│       ├── components/     # Layout, shared UI
│       ├── services/       # Axios API calls
│       ├── hooks/          # Custom React hooks
│       └── styles/         # Global CSS
├── backend/                # FastAPI app
│   └── app/
│       ├── api/            # Route handlers: auth, chat, reports, stats
│       ├── core/           # Config, DB session
│       ├── models/         # SQLAlchemy models
│       ├── schemas/        # Pydantic schemas
│       └── services/       # Business logic
├── nginx/                  # Reverse proxy config
├── docker-compose.yml
└── .env.example
```

---

## Features

- 🤖 **AI Chat Companion** — anonymous support via Claude API
- 🚨 **Anonymous Reporting** — flag vaping, smoking, fighting incidents
- 📊 **HBSC Data Dashboard** — interactive charts from real WHO research
- 📚 **Awareness Cards** — myth-busting facts for teens
- 📓 **Private Journal** — daily mood check-ins

---

## Development (without Docker)

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
