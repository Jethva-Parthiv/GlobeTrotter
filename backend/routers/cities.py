from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/cities", tags=["cities"])


@router.get("", response_model=schemas.PaginatedCities)
def search_cities(
    q: Optional[str] = None,
    country: Optional[str] = None,
    region: Optional[str] = None,
    sort: str = Query("popularity"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(models.City)

    if q:
        query = query.filter(models.City.name.ilike(f"%{q}%"))
    if country:
        query = query.filter(models.City.country.ilike(f"%{country}%"))
    if region:
        query = query.filter(models.City.region.ilike(f"%{region}%"))

    total = query.count()

    if sort == "name":
        query = query.order_by(models.City.name.asc())
    elif sort == "cost_index":
        query = query.order_by(models.City.cost_index.asc())
    else:  # popularity
        query = query.order_by(models.City.popularity.desc())

    cities = query.offset(offset).limit(limit).all()
    return schemas.PaginatedCities(
        total=total,
        cities=[
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
            for c in cities
        ],
    )


@router.get("/{city_id}", response_model=schemas.CityOut)
def get_city(city_id: str, db: Session = Depends(get_db)):
    city = db.query(models.City).filter(models.City.id == city_id).first()
    if not city:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="City not found")
    return schemas.CityOut(
        id=city.id,
        name=city.name,
        country=city.country,
        region=city.region,
        cost_index=city.cost_index,
        popularity=city.popularity,
        image_url=city.image_url,
        description=city.description,
    )
