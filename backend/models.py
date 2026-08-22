import uuid
from datetime import datetime
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    photo_url = Column(String(1024), nullable=True)
    language_preference = Column(String(10), default="en", nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    trips = relationship("Trip", back_populates="user", cascade="all, delete-orphan")


class City(Base):
    __tablename__ = "cities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), index=True, nullable=False)
    country = Column(String(255), index=True, nullable=False)
    region = Column(String(100), nullable=True)
    cost_index = Column(Integer, default=3, nullable=False)  # 1-5 scale
    popularity = Column(Integer, default=50, nullable=False)  # 1-100 scale
    image_url = Column(String(1024), nullable=True)
    description = Column(Text, nullable=True)

    activities = relationship("Activity", back_populates="city", cascade="all, delete-orphan")
    stops = relationship("Stop", back_populates="city")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    city_id = Column(String(36), ForeignKey("cities.id", ondelete="CASCADE"), nullable=False)
    category = Column(String(50), nullable=False)  # sightseeing, food, adventure, culture, etc.
    estimated_cost = Column(Float, default=0.0, nullable=False)  # in INR (₹)
    duration_hours = Column(Float, default=1.0, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(1024), nullable=True)

    city = relationship("City", back_populates="activities")
    stop_activities = relationship("StopActivity", back_populates="activity")


class Trip(Base):
    __tablename__ = "trips"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(String(10), nullable=False)  # YYYY-MM-DD
    end_date = Column(String(10), nullable=False)    # YYYY-MM-DD
    cover_photo_url = Column(String(1024), nullable=True)
    is_public = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="trips")
    stops = relationship("Stop", back_populates="trip", order_by="Stop.order", cascade="all, delete-orphan")


class Stop(Base):
    __tablename__ = "stops"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    trip_id = Column(String(36), ForeignKey("trips.id", ondelete="CASCADE"), nullable=False)
    city_id = Column(String(36), ForeignKey("cities.id"), nullable=False)
    arrival_date = Column(String(10), nullable=False)    # YYYY-MM-DD
    departure_date = Column(String(10), nullable=False)  # YYYY-MM-DD
    transport_cost = Column(Float, default=0.0, nullable=False)  # in INR (₹)
    stay_cost = Column(Float, default=0.0, nullable=False)       # in INR (₹)
    order = Column(Integer, default=1, nullable=False)

    trip = relationship("Trip", back_populates="stops")
    city = relationship("City", back_populates="stops")
    activities = relationship("StopActivity", back_populates="stop", order_by="StopActivity.order", cascade="all, delete-orphan")


class StopActivity(Base):
    __tablename__ = "stop_activities"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    stop_id = Column(String(36), ForeignKey("stops.id", ondelete="CASCADE"), nullable=False)
    activity_id = Column(String(36), ForeignKey("activities.id"), nullable=False)
    date = Column(String(10), nullable=False)            # YYYY-MM-DD
    start_time = Column(String(10), nullable=True)       # HH:MM
    end_time = Column(String(10), nullable=True)         # HH:MM
    order = Column(Integer, default=0, nullable=False)

    stop = relationship("Stop", back_populates="activities")
    activity = relationship("Activity", back_populates="stop_activities")
