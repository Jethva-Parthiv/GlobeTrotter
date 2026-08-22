from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from dependencies import get_current_user, get_optional_current_user
from routers.trips import serialize_stop

router = APIRouter(prefix="/api/trips/{trip_id}/stops", tags=["stops"])


def verify_trip_owner(trip_id: str, user_id: str, db: Session) -> models.Trip:
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return trip


@router.post("", response_model=schemas.StopOut, status_code=status.HTTP_201_CREATED)
def add_stop(
    trip_id: str,
    payload: schemas.StopCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    verify_trip_owner(trip_id, current_user.id, db)

    city = db.query(models.City).filter(models.City.id == payload.city_id).first()
    if not city:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")

    stop = models.Stop(
        trip_id=trip_id,
        city_id=payload.city_id,
        arrival_date=payload.arrival_date,
        departure_date=payload.departure_date,
        transport_cost=payload.transport_cost,
        stay_cost=payload.stay_cost,
        order=payload.order,
    )
    db.add(stop)
    db.commit()
    db.refresh(stop)
    return serialize_stop(stop)


@router.get("", response_model=List[schemas.StopOut])
def list_stops(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_current_user),
):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    if not trip.is_public:
        if not current_user or trip.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    stops = db.query(models.Stop).filter(models.Stop.trip_id == trip_id).order_by(models.Stop.order.asc()).all()
    return [serialize_stop(s) for s in stops]


@router.patch("/{stop_id}", response_model=schemas.StopOut)
def update_stop(
    trip_id: str,
    stop_id: str,
    payload: schemas.StopUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    verify_trip_owner(trip_id, current_user.id, db)

    stop = db.query(models.Stop).filter(models.Stop.id == stop_id, models.Stop.trip_id == trip_id).first()
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")

    if payload.arrival_date is not None:
        stop.arrival_date = payload.arrival_date
    if payload.departure_date is not None:
        stop.departure_date = payload.departure_date
    if payload.transport_cost is not None:
        stop.transport_cost = payload.transport_cost
    if payload.stay_cost is not None:
        stop.stay_cost = payload.stay_cost
    if payload.order is not None:
        stop.order = payload.order

    db.commit()
    db.refresh(stop)
    return serialize_stop(stop)


@router.delete("/{stop_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stop(
    trip_id: str,
    stop_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    verify_trip_owner(trip_id, current_user.id, db)

    stop = db.query(models.Stop).filter(models.Stop.id == stop_id, models.Stop.trip_id == trip_id).first()
    if not stop:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stop not found")

    db.delete(stop)
    db.commit()
    return None


@router.patch("/reorder", response_model=List[schemas.StopOut])
def reorder_stops(
    trip_id: str,
    payload: schemas.ReorderRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    verify_trip_owner(trip_id, current_user.id, db)

    for item in payload.stop_orders:
        stop = db.query(models.Stop).filter(models.Stop.id == item.stop_id, models.Stop.trip_id == trip_id).first()
        if stop:
            stop.order = item.order

    db.commit()
    stops = db.query(models.Stop).filter(models.Stop.trip_id == trip_id).order_by(models.Stop.order.asc()).all()
    return [serialize_stop(s) for s in stops]
