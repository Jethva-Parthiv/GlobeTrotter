from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from dependencies import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/analytics", response_model=schemas.AnalyticsOut)
def get_analytics(
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    total_users = db.query(models.User).count()
    total_trips = db.query(models.Trip).count()
    total_public_trips = db.query(models.Trip).filter(models.Trip.is_public == True).count()  # noqa: E712

    # Trips created last 7 days
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    trips_7d = db.query(models.Trip).filter(models.Trip.created_at >= seven_days_ago).count()

    # Top cities added in stops
    top_cities_query = (
        db.query(models.City.id, models.City.name, func.count(models.Stop.id).label("times_added"))
        .join(models.Stop, models.Stop.city_id == models.City.id)
        .group_by(models.City.id, models.City.name)
        .order_by(func.count(models.Stop.id).desc())
        .limit(5)
        .all()
    )
    top_cities = [
        schemas.CityPopularity(city_id=c[0], city_name=c[1], times_added=c[2])
        for c in top_cities_query
    ]

    # Top activities added
    top_activities_query = (
        db.query(models.Activity.id, models.Activity.name, func.count(models.StopActivity.id).label("times_added"))
        .join(models.StopActivity, models.StopActivity.activity_id == models.Activity.id)
        .group_by(models.Activity.id, models.Activity.name)
        .order_by(func.count(models.StopActivity.id).desc())
        .limit(5)
        .all()
    )
    top_activities = [
        schemas.ActivityPopularity(activity_id=a[0], activity_name=a[1], times_added=a[2])
        for a in top_activities_query
    ]

    total_stops = db.query(models.Stop).count()
    avg_stops = (total_stops / total_trips) if total_trips > 0 else 0.0

    return schemas.AnalyticsOut(
        total_users=total_users,
        total_trips=total_trips,
        total_public_trips=total_public_trips,
        top_cities=top_cities,
        top_activities=top_activities,
        trips_created_last_7_days=trips_7d,
        avg_stops_per_trip=round(avg_stops, 1),
    )


@router.get("/users", response_model=schemas.PaginatedAdminUsers)
def list_admin_users(
    q: Optional[str] = None,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin),
):
    query = db.query(models.User)
    if q:
        query = query.filter((models.User.email.ilike(f"%{q}%")) | (models.User.name.ilike(f"%{q}%")))

    total = query.count()
    users = query.order_by(models.User.created_at.desc()).offset(offset).limit(limit).all()

    user_list = []
    for u in users:
        trip_cnt = db.query(models.Trip).filter(models.Trip.user_id == u.id).count()
        user_list.append(
            schemas.AdminUserOut(
                id=u.id,
                email=u.email,
                name=u.name,
                trip_count=trip_cnt,
                created_at=u.created_at.isoformat() + "Z" if u.created_at else "",
            )
        )

    return schemas.PaginatedAdminUsers(total=total, users=user_list)
