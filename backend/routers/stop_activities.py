from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from dependencies import get_current_user, get_optional_current_user

router = APIRouter(
    prefix="/api/trips/{trip_id}/stops/{stop_id}/activities",
    tags=["stop_activities"],
)


def verify_stop_owner(trip_id: str, stop_id: str, user_id: str, db: Session) -> models.Stop:
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    stop = db.query(models.Stop).filter(models.Stop.id == stop_id, models.Stop.trip_id == trip_id).first()
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")
    return stop


def serialize_stop_activity(sa: models.StopActivity) -> schemas.StopActivityOut:
    return schemas.StopActivityOut(
        id=sa.id,
        stop_id=sa.stop_id,
        activity_id=sa.activity_id,
        activity_name=sa.activity.name if sa.activity else "",
        category=sa.activity.category if sa.activity else "",
        estimated_cost=sa.activity.estimated_cost if sa.activity else 0.0,
        date=sa.date,
        start_time=sa.start_time,
        end_time=sa.end_time,
        order=sa.order,
        image_url=sa.activity.image_url if sa.activity else None,
        description=sa.activity.description if sa.activity else None,
    )


@router.post("", response_model=schemas.StopActivityOut, status_code=status.HTTP_201_CREATED)
def add_activity_to_stop(
    trip_id: str,
    stop_id: str,
    payload: schemas.StopActivityCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    stop = verify_stop_owner(trip_id, stop_id, current_user.id, db)

    activity = db.query(models.Activity).filter(models.Activity.id == payload.activity_id).first()
    if not activity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity not found")

    stop_activity = models.StopActivity(
        stop_id=stop.id,
        activity_id=payload.activity_id,
        date=payload.date,
        start_time=payload.start_time,
        end_time=payload.end_time,
        order=payload.order,
    )
    db.add(stop_activity)
    db.commit()
    db.refresh(stop_activity)
    return serialize_stop_activity(stop_activity)


@router.get("", response_model=List[schemas.StopActivityOut])
def list_stop_activities(
    trip_id: str,
    stop_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_current_user),
):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    if not trip.is_public:
        if not current_user or trip.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    stop = db.query(models.Stop).filter(models.Stop.id == stop_id, models.Stop.trip_id == trip_id).first()
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")

    activities = (
        db.query(models.StopActivity)
        .filter(models.StopActivity.stop_id == stop_id)
        .order_by(models.StopActivity.date.asc(), models.StopActivity.order.asc())
        .all()
    )
    return [serialize_stop_activity(sa) for sa in activities]


@router.patch("/{stop_activity_id}", response_model=schemas.StopActivityOut)
def update_stop_activity(
    trip_id: str,
    stop_id: str,
    stop_activity_id: str,
    payload: schemas.StopActivityUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    verify_stop_owner(trip_id, stop_id, current_user.id, db)

    sa = (
        db.query(models.StopActivity)
        .filter(models.StopActivity.id == stop_activity_id, models.StopActivity.stop_id == stop_id)
        .first()
    )
    if not sa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity on stop not found")

    if payload.date is not None:
        sa.date = payload.date
    if payload.start_time is not None:
        sa.start_time = payload.start_time
    if payload.end_time is not None:
        sa.end_time = payload.end_time
    if payload.order is not None:
        sa.order = payload.order

    db.commit()
    db.refresh(sa)
    return serialize_stop_activity(sa)


@router.delete("/{stop_activity_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_stop_activity(
    trip_id: str,
    stop_id: str,
    stop_activity_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    verify_stop_owner(trip_id, stop_id, current_user.id, db)

    sa = (
        db.query(models.StopActivity)
        .filter(models.StopActivity.id == stop_activity_id, models.StopActivity.stop_id == stop_id)
        .first()
    )
    if not sa:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity on stop not found")

    db.delete(sa)
    db.commit()
    return None
