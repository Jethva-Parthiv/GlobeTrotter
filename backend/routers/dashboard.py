from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from dependencies import get_current_user
from routers.trips import calculate_trip_stats

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("", response_model=schemas.DashboardOut)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    all_trips = db.query(models.Trip).filter(models.Trip.user_id == current_user.id).all()

    today_str = datetime.utcnow().strftime("%Y-%m-%d")

    upcoming = []
    recent = []
    total_budget = 0.0

    sorted_trips = sorted(all_trips, key=lambda t: t.start_date)
    for trip in sorted_trips:
        stop_cnt, trip_cost = calculate_trip_stats(trip)
        total_budget += trip_cost

        trip_item = schemas.DashboardTripItem(
            id=trip.id,
            name=trip.name,
            start_date=trip.start_date,
            end_date=trip.end_date,
            stop_count=stop_cnt,
            total_estimated_cost=trip_cost,
            cover_photo_url=trip.cover_photo_url,
        )

        if trip.end_date >= today_str:
            upcoming.append(trip_item)
        else:
            recent.append(trip_item)

    # Top recommended cities
    recommended_cities_models = (
        db.query(models.City).order_by(models.City.popularity.desc()).limit(5).all()
    )
    recommended_cities = [
        schemas.CityOut(
            id=c.id,
            name=c.name,
            country=c.country,
            region=c.region,
            cost_index=c.cost_index,
            popularity=c.popularity,
            image_url=c.image_url,
            description=c.description,
        )
        for c in recommended_cities_models
    ]

    return schemas.DashboardOut(
        welcome_name=current_user.name.split()[0] if current_user.name else "Traveler",
        upcoming_trips=upcoming[:5],
        recent_trips=recent[:5],
        recommended_cities=recommended_cities,
        total_trips=len(all_trips),
        total_budget_all_trips=total_budget,
    )
