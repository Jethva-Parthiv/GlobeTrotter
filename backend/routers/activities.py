from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas

router = APIRouter(tags=["activities"])


@router.get("/api/cities/{city_id}/activities", response_model=schemas.PaginatedActivities)
def search_activities(
    city_id: str,
    q: Optional[str] = None,
    category: Optional[str] = None,
    max_cost: Optional[float] = None,
    max_duration: Optional[float] = None,
    sort: str = Query("name"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(models.Activity).filter(models.Activity.city_id == city_id)

    if q:
        query = query.filter(models.Activity.name.ilike(f"%{q}%"))
    if category:
        query = query.filter(models.Activity.category == category)
    if max_cost is not None:
        query = query.filter(models.Activity.estimated_cost <= max_cost)
    if max_duration is not None:
        query = query.filter(models.Activity.duration_hours <= max_duration)

    total = query.count()

    if sort == "cost":
        query = query.order_by(models.Activity.estimated_cost.asc())
    elif sort == "duration":
        query = query.order_by(models.Activity.duration_hours.asc())
    else:  # name
        query = query.order_by(models.Activity.name.asc())

    activities = query.offset(offset).limit(limit).all()
    return schemas.PaginatedActivities(
        total=total,
        activities=[
            schemas.ActivityOut(
                id=a.id,
                name=a.name,
                city_id=a.city_id,
                category=a.category,
                estimated_cost=a.estimated_cost,
                duration_hours=a.duration_hours,
                description=a.description,
                image_url=a.image_url,
            )
            for a in activities
        ],
    )


@router.get("/api/activities/{activity_id}", response_model=schemas.ActivityOut)
def get_activity(activity_id: str, db: Session = Depends(get_db)):
    activity = db.query(models.Activity).filter(models.Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")
    return schemas.ActivityOut(
        id=activity.id,
        name=activity.name,
        city_id=activity.city_id,
        category=activity.category,
        estimated_cost=activity.estimated_cost,
        duration_hours=activity.duration_hours,
        description=activity.description,
        image_url=activity.image_url,
    )
