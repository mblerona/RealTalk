# RealTalk 🛡️

> *Speak up. Stay safe.*

Anonymous incident reporting platform for students aged 11–15 — built with React, FastAPI & PostgreSQL, grounded in WHO/HBSC 2021/22 research data on youth health and safety.

---

## What is RealTalk?

RealTalk is a web application that addresses two of the most pressing problems documented in the WHO/HBSC (Health Behaviour in School-aged Children) study among adolescents: **substance use (vaping & smoking)** and **school violence (fighting & bullying)**.

According to HBSC 2021/22 data:
- **32%** of 15-year-olds have used e-cigarettes
- **10%** of teens have been involved in physical fights
- **16%** are victims of cyberbullying — up from 12% in 2018

RealTalk gives students a safe, fully anonymous way to report incidents happening at their school, while giving school staff a real-time dashboard to monitor and respond to them.

---

## Features

| Feature | Description |
|---|---|
|  **Anonymous Reporting** | Students submit incident reports — no account, no tracking, no identity stored |
|  **School Dashboard** | Schools register and view all reports submitted for their school |
|  **School Analytics** | Charts showing reports by type, location hotspots, and trends over time |
|  **HBSC Data Visualizations** | Interactive charts from real WHO/HBSC international research |
|  **Awareness Cards** | Fact cards about vaping, smoking, fighting, and peer pressure — tap to reveal |
|  **Mood Journal** | Private daily mood check-ins with trend chart (requires student account) |
|  **AI Companion** | Anonymous AI chat support powered by Grok API |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | FastAPI (Python 3.12) |
| Database | PostgreSQL 16 |
| Auth | JWT (python-jose) + bcrypt |
| Charts | Recharts |
| AI | Grok API by xAI |
| Proxy | Nginx |
| Containers | Docker + Docker Compose |

---

## Getting Started

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### 1. Clone the repo
```bash
git clone https://github.com/your-username/realtalk.git
cd realtalk
```

### 2. Set up environment variables
```bash
cp .env.example .env
```

Open `.env` and set at minimum:
```env
SECRET_KEY=any_long_random_string_here
```

### 3. Run
```bash
docker compose up --build
```

First build takes 3–5 minutes. After that:

| URL | What |
|---|---|
| `http://localhost:5173` | The React app |
| `http://localhost:8000/docs` | FastAPI interactive API docs |
| `http://localhost:80` | Via Nginx proxy |

---

## How It Works

### For Students
1. Go to **Report** — no account needed
2. Select incident type (vaping / smoking / fighting / bullying)
3. Pick the school from the dropdown, add location and description (optional)
4. Submit — completely anonymous, a random token is generated instead of storing any identity

### For Schools
1. Go to **School login** → Register with your official school name and email
2. Log in to see your **Reports Dashboard** — all anonymous reports submitted for your school
3. Go to **Analytics** — charts showing report trends, hotspot locations, and breakdown by type

---

## Project Structure

```
realtalk/
├── frontend/
│   └── src/
│       ├── pages/              # Home, Report, Stats, Awareness, Journal, Dashboard, Login, Chat
│       ├── components/         # Layout (role-aware navbar)
│       ├── context/            # AuthContext (JWT auth state)
│       └── services/           # Axios API client
├── backend/
│   └── app/
│       ├── api/                # auth, reports, stats, journal, schools, chat
│       ├── core/               # config, database, security, deps
│       ├── models/             # SQLAlchemy models (User, Report, JournalEntry)
│       └── schemas/            # Pydantic request/response schemas
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
└── .env.example
```

---

## Research Background

This project was developed as part of a Computer Science course assignment at **Ss. Cyril and Methodius University, Skopje**, inspired by findings from the [HBSC (Health Behaviour in School-aged Children)](https://www.hbsc.org) study — a WHO collaborative research project tracking adolescent health across 50+ countries.

Key data sources used:
- [WHO/HBSC Report: Adolescent Substance Use 2021/22](https://iris.who.int/handle/10665/376573)
- [WHO/HBSC Report: Peer Violence and Bullying 2021/22](https://iris.who.int/handle/10665/376323)
- [MK HBSC Platform — North Macedonia](https://www.mkhbsc.com)

---

## Development Without Docker

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `SECRET_KEY` | JWT signing key — any random string | ✅ |
| `POSTGRES_USER` | Database user | ✅ |
| `POSTGRES_PASSWORD` | Database password | ✅ |
| `POSTGRES_DB` | Database name | ✅ |
| `GROK_API_KEY` | Grok API key for AI chat | ✅ |
| `FRONTEND_URL` | Frontend origin for CORS | ✅ |

---

