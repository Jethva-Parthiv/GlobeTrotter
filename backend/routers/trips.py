from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from dependencies import get_current_user, get_optional_current_user

router = APIRouter(prefix="/api/trips", tags=["trips"])


def calculate_trip_stats(trip: models.Trip):
    stop_count = len(trip.stops)
    total_cost = 0.0
    for stop in trip.stops:
        total_cost += (stop.transport_cost or 0.0) + (stop.stay_cost or 0.0)
        for sa in stop.activities:
            if sa.activity:
                total_cost += sa.activity.estimated_cost or 0.0
    return stop_count, total_cost


def serialize_trip(trip: models.Trip) -> schemas.TripOut:
    stop_count, total_cost = calculate_trip_stats(trip)
    return schemas.TripOut(
        id=trip.id,
        user_id=trip.user_id,
        name=trip.name,
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date,
        cover_photo_url=trip.cover_photo_url,
        is_public=trip.is_public,
        stop_count=stop_count,
        total_estimated_cost=total_cost,
        created_at=trip.created_at.isoformat() + "Z" if trip.created_at else "",
        updated_at=trip.updated_at.isoformat() + "Z" if trip.updated_at else "",
    )


def serialize_stop(stop: models.Stop) -> schemas.StopOut:
    activities_out = []
    stop_act_cost = 0.0
    for sa in stop.activities:
        act_cost = sa.activity.estimated_cost if sa.activity else 0.0
        stop_act_cost += act_cost
        activities_out.append(
            schemas.StopActivityOut(
                id=sa.id,
                stop_id=sa.stop_id,
                activity_id=sa.activity_id,
                activity_name=sa.activity.name if sa.activity else "",
                category=sa.activity.category if sa.activity else "",
                estimated_cost=act_cost,
                date=sa.date,
                start_time=sa.start_time,
                end_time=sa.end_time,
                order=sa.order,
                image_url=sa.activity.image_url if sa.activity else None,
                description=sa.activity.description if sa.activity else None,
            )
        )

    total_stop_cost = (stop.transport_cost or 0.0) + (stop.stay_cost or 0.0) + stop_act_cost
    return schemas.StopOut(
        id=stop.id,
        trip_id=stop.trip_id,
        city_id=stop.city_id,
        city_name=stop.city.name if stop.city else "",
        country=stop.city.country if stop.city else "",
        arrival_date=stop.arrival_date,
        departure_date=stop.departure_date,
        transport_cost=stop.transport_cost,
        stay_cost=stop.stay_cost,
        order=stop.order,
        activities=activities_out,
        total_cost=total_stop_cost,
    )


@router.post("", response_model=schemas.TripOut, status_code=status.HTTP_201_CREATED)
def create_trip(
    payload: schemas.TripCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    trip = models.Trip(
        user_id=current_user.id,
        name=payload.name,
        description=payload.description,
        start_date=payload.start_date,
        end_date=payload.end_date,
        cover_photo_url=payload.cover_photo_url,
        is_public=payload.is_public,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return serialize_trip(trip)


@router.get("", response_model=List[schemas.TripOut])
def list_trips(
    sort: str = Query("upcoming"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Trip).filter(models.Trip.user_id == current_user.id)
    if sort == "created":
        query = query.order_by(models.Trip.created_at.desc())
    elif sort == "name":
        query = query.order_by(models.Trip.name.asc())
    else:  # upcoming
        query = query.order_by(models.Trip.start_date.asc())

    trips = query.all()
    return [serialize_trip(t) for t in trips]


@router.get("/{trip_id}", response_model=schemas.TripDetailOut)
def get_trip(
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

    trip_base = serialize_trip(trip)
    stops_out = [serialize_stop(s) for s in trip.stops]
    return schemas.TripDetailOut(**trip_base.dict(), stops=stops_out)


@router.patch("/{trip_id}", response_model=schemas.TripOut)
def update_trip(
    trip_id: str,
    payload: schemas.TripUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    if payload.name is not None:
        trip.name = payload.name
    if payload.description is not None:
        trip.description = payload.description
    if payload.start_date is not None:
        trip.start_date = payload.start_date
    if payload.end_date is not None:
        trip.end_date = payload.end_date
    if payload.cover_photo_url is not None:
        trip.cover_photo_url = payload.cover_photo_url
    if payload.is_public is not None:
        trip.is_public = payload.is_public

    db.commit()
    db.refresh(trip)
    return serialize_trip(trip)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    db.delete(trip)
    db.commit()
    return None


@router.post("/{trip_id}/copy", response_model=schemas.TripOut, status_code=status.HTTP_201_CREATED)
def copy_trip(
    trip_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    original_trip = db.query(models.Trip).filter(models.Trip.id == trip_id).first()
    if not original_trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

    if not original_trip.is_public and original_trip.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Trip is private")

    new_trip = models.Trip(
        user_id=current_user.id,
        name=f"Copy of {original_trip.name}",
        description=original_trip.description,
        start_date=original_trip.start_date,
        end_date=original_trip.end_date,
        cover_photo_url=original_trip.cover_photo_url,
        is_public=original_trip.is_public,
    )

    db.add(new_trip)
    db.flush()

    for original_stop in original_trip.stops:
        new_stop = models.Stop(
            trip_id=new_trip.id,
            city_id=original_stop.city_id,
            arrival_date=original_stop.arrival_date,
            departure_date=original_stop.departure_date,
            transport_cost=original_stop.transport_cost,
            stay_cost=original_stop.stay_cost,
            order=original_stop.order,
        )
        db.add(new_stop)
        db.flush()

        for original_sa in original_stop.activities:
            new_sa = models.StopActivity(
                stop_id=new_stop.id,
                activity_id=original_sa.activity_id,
                date=original_sa.date,
                start_time=original_sa.start_time,
                end_time=original_sa.end_time,
                order=original_sa.order,
            )
            db.add(new_sa)

    db.commit()
    db.refresh(new_trip)
    return serialize_trip(new_trip)
