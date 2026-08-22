from typing import List, Optional
from pydantic import BaseModel, EmailStr


# ==========================================
# User Schemas
# ==========================================
class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    photo_url: Optional[str] = None
    language_preference: Optional[str] = None


class UserOut(UserBase):
    id: str
    photo_url: Optional[str] = None
    language_preference: str = "en"
    is_admin: bool = False
    created_at: str

    class Config:
        from_attributes = True


class AdminUserOut(BaseModel):
    id: str
    email: str
    name: str
    trip_count: int
    created_at: str


class PaginatedAdminUsers(BaseModel):
    total: int
    users: List[AdminUserOut]


# ==========================================
# Auth Schemas
# ==========================================
class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# ==========================================
# City & Activity Catalog Schemas
# ==========================================
class CityOut(BaseModel):
    id: str
    name: str
    country: str
    region: Optional[str] = None
    cost_index: int
    popularity: int
    image_url: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


class PaginatedCities(BaseModel):
    total: int
    cities: List[CityOut]


class ActivityOut(BaseModel):
    id: str
    name: str
    city_id: str
    category: str
    estimated_cost: float  # INR (₹)
    duration_hours: float
    description: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class PaginatedActivities(BaseModel):
    total: int
    activities: List[ActivityOut]


# ==========================================
# Stop Activity Schemas
# ==========================================
class StopActivityCreate(BaseModel):
    activity_id: str
    date: str  # ISO 8601 date, e.g. "2026-09-02"
    start_time: Optional[str] = None  # e.g. "09:00"
    end_time: Optional[str] = None  # e.g. "11:30"
    order: int = 0


class StopActivityUpdate(BaseModel):
    date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    order: Optional[int] = None


class StopActivityOut(BaseModel):
    id: str
    stop_id: str
    activity_id: str
    activity_name: str
    category: str
    estimated_cost: float  # INR (₹)
    date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    order: int
    image_url: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True


# ==========================================
# Stop Schemas
# ==========================================
class StopCreate(BaseModel):
    city_id: str
    arrival_date: str
    departure_date: str
    transport_cost: float = 0.0  # INR (₹)
    stay_cost: float = 0.0  # INR (₹)
    order: int = 1


class StopUpdate(BaseModel):
    arrival_date: Optional[str] = None
    departure_date: Optional[str] = None
    transport_cost: Optional[float] = None
    stay_cost: Optional[float] = None
    order: Optional[int] = None


class StopOrderItem(BaseModel):
    stop_id: str
    order: int


class ReorderRequest(BaseModel):
    stop_orders: List[StopOrderItem]


class StopOut(BaseModel):
    id: str
    trip_id: str
    city_id: str
    city_name: str
    country: str
    arrival_date: str
    departure_date: str
    transport_cost: float  # INR (₹)
    stay_cost: float  # INR (₹)
    order: int
    activities: List[StopActivityOut] = []
    total_cost: float  # INR (₹)

    class Config:
        from_attributes = True


# ==========================================
# Trip Schemas
# ==========================================
class TripCreate(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: str  # ISO 8601 date
    end_date: str
    cover_photo_url: Optional[str] = None
    is_public: bool = False


class TripUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    cover_photo_url: Optional[str] = None
    is_public: Optional[bool] = None


class TripOut(BaseModel):
    id: str
    user_id: str
    name: str
    description: Optional[str] = None
    start_date: str
    end_date: str
    cover_photo_url: Optional[str] = None
    is_public: bool
    stop_count: int = 0
    total_estimated_cost: float = 0.0  # INR (₹)
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class TripDetailOut(TripOut):
    stops: List[StopOut] = []


# ==========================================
# Budget Schemas (INR ₹)
# ==========================================
class StopCostSummary(BaseModel):
    stop_id: str
    city_name: str
    transport_cost: float
    stay_cost: float
    activity_cost: float
    total: float


class BudgetBreakdown(BaseModel):
    trip_id: str
    currency: str = "INR"
    total_cost: float
    transport_total: float
    stay_total: float
    activity_total: float
    daily_average: float
    per_stop: List[StopCostSummary]


class DailyCost(BaseModel):
    date: str
    cost: float
    activities: List[str]


# ==========================================
# Dashboard Schemas
# ==========================================
class DashboardTripItem(BaseModel):
    id: str
    name: str
    start_date: str
    end_date: str
    stop_count: int
    total_estimated_cost: float
    cover_photo_url: Optional[str] = None


class DashboardOut(BaseModel):
    welcome_name: str
    upcoming_trips: List[DashboardTripItem] = []
    recent_trips: List[DashboardTripItem] = []
    recommended_cities: List[CityOut] = []
    total_trips: int = 0
    total_budget_all_trips: float = 0.0


# ==========================================
# Admin Analytics Schemas
# ==========================================
class CityPopularity(BaseModel):
    city_id: str
    city_name: str
    times_added: int


class ActivityPopularity(BaseModel):
    activity_id: str
    activity_name: str
    times_added: int


class AnalyticsOut(BaseModel):
    total_users: int
    total_trips: int
    total_public_trips: int
    top_cities: List[CityPopularity]
    top_activities: List[ActivityPopularity]
    trips_created_last_7_days: int
    avg_stops_per_trip: float
