from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from routers.trips import serialize_stop, serialize_trip

router = APIRouter(prefix="/api/public/trips", tags=["public"])


@router.get("", response_model=List[schemas.TripOut])
def list_public_trips(
    sort: str = Query("recent"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(models.Trip).filter(models.Trip.is_public == True)  # noqa: E712
    if sort == "popular":
        query = query.order_by(models.Trip.created_at.desc())
    else:  # recent
        query = query.order_by(models.Trip.created_at.desc())

    trips = query.offset(offset).limit(limit).all()
    return [serialize_trip(t) for t in trips]


@router.get("/{trip_id}", response_model=schemas.TripDetailOut)
def get_public_trip(trip_id: str, db: Session = Depends(get_db)):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    if not trip.is_public:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Trip is private")

    trip_base = serialize_trip(trip)
    stops_out = [serialize_stop(s) for s in trip.stops]
    return schemas.TripDetailOut(**trip_base.dict(), stops=stops_out)
