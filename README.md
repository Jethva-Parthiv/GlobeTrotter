# 🌍 GlobeTrotter — Empowering Personalized Travel Planning

> A full-stack, multi-city travel planning platform built with **FastAPI** and **React**. Plan trips, build day-by-day itineraries, track budgets, discover destinations, and share your adventures — all in one place.

---

## ✨ Key Features

### 🧳 Trip Planning
- **Multi-city itineraries** — Add multiple stops (cities) per trip with arrival/departure dates
- **Day-by-day scheduling** — Assign activities to specific dates and time slots within each stop
- **Drag-and-drop reordering** — Rearrange stops and activities with intuitive drag-and-drop
- **Calendar view** — Visualize your entire itinerary on a day-by-day calendar
- **Trip duplication** — Clone any trip as a starting template

### 💰 Budget Tracking
- **Per-stop cost breakdown** — Transport costs, accommodation costs, and activity costs per city
- **Visual budget charts** — Bar charts showing spending distribution across stops
- **Real-time totals** — Automatic cost aggregation across all stops and activities
- **All costs in INR (₹)** — Consistent Indian Rupee currency throughout

### 🌐 Discover & Explore
- **Browse 10+ curated cities** — With cost indexes, popularity scores, and descriptions
- **35+ activities catalog** — Sightseeing, food tours, adventure, and cultural activities
- **City detail pages** — View all available activities for a destination
- **Public trip feed** — Browse itineraries shared by other travelers for inspiration

### 🔗 Share & Collaborate
- **Public/private trips** — Toggle trip visibility
- **Shareable trip links** — Public trips accessible via `/shared/:tripId` without login
- **Full itinerary view** — Beautifully rendered read-only itinerary page

### 📸 Image Upload
- **Drag-and-drop cover photos** — Upload trip cover images directly from your device
- **Profile avatar upload** — Upload profile photos with instant preview
- **Server-side storage** — Images stored in organized `uploads/` directories
- **File validation** — Supports JPG, PNG, WEBP, GIF (max 10MB)

### 🛡️ Admin Panel
- **Analytics dashboard** — Total users, trips, public trips, activity in last 7 days
- **Top cities & activities** — See which destinations and activities are most popular
- **User management** — Search, browse, and view user trip counts
- **Average stops per trip** — Platform-wide engagement metrics

### 🔐 Authentication
- **JWT Bearer authentication** — Secure token-based auth
- **Sign up / Sign in / Forgot password** — Full auth flow
- **Profile management** — Update name, email, avatar, and language preference
- **Role-based access** — Regular users vs. admin with protected routes

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TailwindCSS 4, React Router 7 |
| **State & Data** | TanStack React Query, React Hook Form, Zod |
| **UI Components** | Lucide Icons, Framer Motion, Recharts, dnd-kit |
| **Backend** | FastAPI, SQLAlchemy, Pydantic v2 |
| **Database** | SQLite (development) — easily switchable to PostgreSQL |
| **Auth** | JWT (python-jose), bcrypt password hashing |
| **File Uploads** | FastAPI UploadFile + StaticFiles serving |

---

## 🏛 Project Structure

```
GlobeTrotter/
├── backend/
│   ├── main.py                 # FastAPI app with CORS, static files, lifespan
│   ├── database.py             # SQLAlchemy engine & session setup
│   ├── models.py               # ORM models (User, City, Activity, Trip, Stop, StopActivity)
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── dependencies.py         # Auth helpers, JWT, password hashing
│   ├── seed.py                 # Comprehensive demo data seeder
│   ├── requirements.txt        # Python dependencies
│   ├── uploads/                # Uploaded images (covers/, avatars/)
│   └── routers/
│       ├── auth.py             # Login, signup, token generation
│       ├── users.py            # Profile CRUD
│       ├── trips.py            # Trip CRUD, duplication
│       ├── stops.py            # Stop CRUD within trips
│       ├── stop_activities.py  # Activity scheduling within stops
│       ├── cities.py           # City catalog browsing
│       ├── activities.py       # Activity catalog browsing
│       ├── budget.py           # Budget breakdown per trip
│       ├── dashboard.py        # User dashboard (upcoming/recent trips)
│       ├── public.py           # Public trip sharing endpoints
│       ├── admin.py            # Admin analytics & user management
│       └── upload.py           # Image file upload endpoint
│
├── frontend/
│   ├── src/
│   │   ├── api/                # Axios API clients (auth, trips, cities, upload, admin)
│   │   ├── components/         # Reusable UI components (Avatar, Button, Card, ImageUpload, etc.)
│   │   ├── constants/          # Routes, query keys, app config
│   │   ├── context/            # AuthContext (React Context + React Query)
│   │   ├── hooks/              # Custom hooks (useAuth, useToast, useDebounce)
│   │   ├── pages/              # 21 page components
│   │   │   ├── DashboardPage       # User home with upcoming/recent trips
│   │   │   ├── TripsPage           # List all user trips
│   │   │   ├── TripBuilderPage     # Full trip editor with drag-and-drop
│   │   │   ├── TripFormPage        # Create/edit trip with image upload
│   │   │   ├── ItineraryViewPage   # Read-only formatted itinerary
│   │   │   ├── CalendarPage        # Day-by-day calendar view
│   │   │   ├── BudgetPage          # Budget breakdown with charts
│   │   │   ├── DiscoverPage        # Discover hub (cities + public trips)
│   │   │   ├── SharedTripPage      # Public shareable trip view
│   │   │   ├── AdminDashboardPage  # Admin analytics
│   │   │   ├── AdminUsersPage      # Admin user management
│   │   │   ├── ProfilePage         # User profile with avatar upload
│   │   │   └── ...
│   │   ├── routes/             # App routing, protected routes, admin routes
│   │   ├── utils/              # Helpers (cn, apiError, imageUrl, formatCurrency)
│   │   └── validations/        # Zod schemas for forms
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
# Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# Mac/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server (auto-creates database & seeds demo data)
uvicorn main:app --reload --port 8000
```

- **API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative (ReDoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# Start dev server
npm run dev
```

- **App**: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Demo Accounts (Pre-seeded)

| Role | Name | Email | Password |
|---|---|---|---|
| 👤 User | Ada Lovelace | `ada@example.com` | `password123` |
| 👤 User | Marco Polo | `marco@example.com` | `password123` |
| 👤 User | Sakura Tanaka | `sakura@example.com` | `password123` |
| 👤 User | Priya Sharma | `priya@example.com` | `password123` |
| 👤 User | Elena García | `elena@example.com` | `password123` |
| 🛡️ Admin | GlobeTrotter Admin | `admin@globetrotter.com` | `admin123` |

### Pre-seeded Data Summary
| Data | Count |
|---|---|
| Users | 6 (5 travelers + 1 admin) |
| Cities | 10 (across Europe, Asia, North America, Oceania, Africa) |
| Activities | 35 (sightseeing, food, culture, adventure) |
| Trips | 10 (mix of public/private, past/upcoming) |
| Stops | 17 (multi-city itineraries) |
| Scheduled Activities | 50+ |

> **To reset the database**: Delete `backend/globetrotter.db` and restart the server. Fresh seed data will be auto-created.

---

## 📡 API Endpoints Overview

| Category | Method | Endpoint | Auth |
|---|---|---|---|
| **Auth** | POST | `/api/auth/signup` | — |
| | POST | `/api/auth/login` | — |
| | GET | `/api/auth/me` | ✅ |
| **Users** | GET | `/api/users/me` | ✅ |
| | PUT | `/api/users/me` | ✅ |
| **Trips** | GET | `/api/trips` | ✅ |
| | POST | `/api/trips` | ✅ |
| | GET | `/api/trips/{id}` | ✅ |
| | PUT | `/api/trips/{id}` | ✅ |
| | DELETE | `/api/trips/{id}` | ✅ |
| | POST | `/api/trips/{id}/duplicate` | ✅ |
| **Stops** | POST | `/api/trips/{id}/stops` | ✅ |
| | PUT | `/api/stops/{id}` | ✅ |
| | DELETE | `/api/stops/{id}` | ✅ |
| **Activities** | POST | `/api/stops/{id}/activities` | ✅ |
| | PUT | `/api/stop-activities/{id}` | ✅ |
| | DELETE | `/api/stop-activities/{id}` | ✅ |
| **Cities** | GET | `/api/cities` | — |
| | GET | `/api/cities/{id}` | — |
| **Activities Catalog** | GET | `/api/activities` | — |
| **Budget** | GET | `/api/trips/{id}/budget` | ✅ |
| **Dashboard** | GET | `/api/dashboard` | ✅ |
| **Public** | GET | `/api/public/trips` | — |
| | GET | `/api/public/trips/{id}` | — |
| **Upload** | POST | `/api/upload/image` | ✅ |
| **Admin** | GET | `/api/admin/analytics` | 🛡️ Admin |
| | GET | `/api/admin/users` | 🛡️ Admin |

---

## 🪙 Conventions

- **Currency**: All monetary values in **Indian Rupees (INR ₹)**
- **Dates**: `YYYY-MM-DD` format (ISO 8601)
- **Times**: `HH:MM` 24-hour format
- **Auth**: JWT Bearer tokens stored in `localStorage`
- **Privacy**: Trips are `private` by default, optionally set to `public`
- **Images**: Uploaded to `backend/uploads/` and served via `/uploads/` static mount

---

## 👥 Team

Built during the **Odoo Hackathon @ LDCE** 🚀
