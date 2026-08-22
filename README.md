# 🌍 GlobeTrotter — Empowering Personalized Travel Planning

> **Hackathon Edition** • Fast, modular, and collaborative multi-city travel planning platform.

---

## 🏗 Project Architecture

```
d:/Odoo_Hackathon_LDCE/
├── backend/                  # FastAPI (Python 3.12) backend
│   ├── main.py               # FastAPI entrypoint with CORS
│   ├── requirements.txt      # Python dependencies
│   └── .env.example
│
├── frontend/                 # React (Vite) UI
│   ├── src/
│   │   ├── index.js     
│   │   ├── services/
│   │   │   └── api.js        # Clean API client matching the backend contract
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
├── .gitignore                # Root gitignore for Python, Node, SQLite
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Backend Setup (FastAPI)

```bash
cd backend

# 1. (Optional) Create and activate virtual environment
python -m venv venv
# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# Mac/Linux:
# source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run FastAPI server (Auto-seeds database with initial cities, activities, & demo users)
python main.py
# Or with uvicorn:
# uvicorn main:app --reload --port 8000
```

- **Interactive API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

#### Default Demo Accounts (Pre-seeded):
- **User**: `ada@example.com` / `password123`
- **Admin**: `admin@globetrotter.com` / `admin123`

---

### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start Vite dev server
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)

---

## 🪙 Currency & Conventions
- **Currency**: All costs are stored and calculated strictly in **Indian Rupees (INR - ₹)**.
- **Privacy**: Supported levels are `public` and `private`.
- **Auth**: JWT Bearer token authentication stored in `localStorage`.
