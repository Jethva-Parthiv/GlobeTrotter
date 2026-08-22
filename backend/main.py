import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from database import Base, engine
from routers import (
    activities,
    admin,
    auth,
    budget,
    cities,
    dashboard,
    public,
    stop_activities,
    stops,
    trips,
    upload,
    users,
)
from seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables exist and seed default catalogue data
    Base.metadata.create_all(bind=engine)
    seed_database()
    os.makedirs("uploads/covers", exist_ok=True)
    os.makedirs("uploads/avatars", exist_ok=True)
    yield


app = FastAPI(
    title="GlobeTrotter API",
    description="Empowering Personalized Travel Planning API (FastAPI + SQLite/PostgreSQL)",
    version="1.1.0",
    lifespan=lifespan,
)

# --- CORS Setup for React / Vite frontend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*",  # Allow all during hackathon local testing
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static files
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include all modular routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(trips.router)
app.include_router(stops.router)
app.include_router(stop_activities.router)
app.include_router(cities.router)
app.include_router(activities.router)
app.include_router(budget.router)
app.include_router(dashboard.router)
app.include_router(public.router)
app.include_router(admin.router)
app.include_router(upload.router)



@app.get("/")
def root():
    return {
        "message": "Welcome to GlobeTrotter API",
        "docs": "/docs",
        "currency": "INR (₹)",
        "version": "1.1.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
