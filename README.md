# Launcher-Template CMS

A full-stack Content Management System with microservices, analytics, admin backend, and social media integration.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS |
| Backend | FastAPI + SQLAlchemy 2 (async) + Pydantic v2 |
| Database | PostgreSQL + Alembic migrations |
| Auth | JWT (python-jose) |
| Charts | Recharts |
| Testing | Vitest (frontend) + pytest (backend) |
| Linting | ESLint + Prettier (frontend) / Ruff (backend) |

## Views

- **News Feed** — Magazine-style layout with social media embed sidebar
- **Single Post** — Full article view with metadata, tags, and related posts
- **Dashboard** — Analytics, traffic, SEO metrics, and content management

## Project Structure

```
.
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # Axios API client
│   │   ├── types/       # Shared TypeScript types
│   │   └── utils/       # Utility helpers
│   └── ...
├── backend/           # FastAPI + PostgreSQL
│   ├── app/
│   │   ├── api/         # Route handlers
│   │   ├── core/        # Config, security
│   │   ├── db/          # Database session
│   │   ├── models/      # SQLAlchemy ORM models
│   │   └── schemas/     # Pydantic schemas
│   ├── migrations/      # Alembic migrations
│   └── tests/
├── .github/
│   └── workflows/       # CI pipelines
└── .vscode/             # Editor settings
```

## Getting Started

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # fill in your values
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # fill in your values
npm run dev
```

### Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required variables.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend dev server |
| `npm run build` | Build frontend for production |
| `npm run lint` | Lint frontend code |
| `npm test` | Run frontend tests |
| `uvicorn app.main:app --reload` | Start backend dev server |
| `pytest` | Run backend tests |
| `alembic upgrade head` | Apply database migrations |
