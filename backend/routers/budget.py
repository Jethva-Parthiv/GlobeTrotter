from datetime import datetime, timedelta
from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from dependencies import get_current_user, get_optional_current_user

router = APIRouter(prefix="/api/trips/{trip_id}/budget", tags=["budget"])


@router.get("", response_model=schemas.BudgetBreakdown)
def get_budget(
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

    transport_total = 0.0
    stay_total = 0.0
    activity_total = 0.0
    per_stop = []

    for stop in trip.stops:
        t_cost = stop.transport_cost or 0.0
        s_cost = stop.stay_cost or 0.0
        a_cost = sum((sa.activity.estimated_cost or 0.0) for sa in stop.activities if sa.activity)

        transport_total += t_cost
        stay_total += s_cost
        activity_total += a_cost

        per_stop.append(
            schemas.StopCostSummary(
                stop_id=stop.id,
                city_name=stop.city.name if stop.city else "",
                transport_cost=t_cost,
                stay_cost=s_cost,
                activity_cost=a_cost,
                total=t_cost + s_cost + a_cost,
            )
        )

    total_cost = transport_total + stay_total + activity_total

    # Calculate days
    try:
        s_dt = datetime.strptime(trip.start_date, "%Y-%m-%d")
        e_dt = datetime.strptime(trip.end_date, "%Y-%m-%d")
        days = max((e_dt - s_dt).days + 1, 1)
    except Exception:
        days = 1

    daily_avg = total_cost / days if days > 0 else 0.0

    return schemas.BudgetBreakdown(
        trip_id=trip.id,
        currency="INR",
        total_cost=total_cost,
        transport_total=transport_total,
        stay_total=stay_total,
        activity_total=activity_total,
        daily_average=round(daily_avg, 2),
        per_stop=per_stop,
    )


@router.get("/daily", response_model=List[schemas.DailyCost])
def get_daily_costs(
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

    daily_map: Dict[str, Dict] = {}

    try:
        s_dt = datetime.strptime(trip.start_date, "%Y-%m-%d")
        e_dt = datetime.strptime(trip.end_date, "%Y-%m-%d")
        curr = s_dt
        while curr <= e_dt:
            d_str = curr.strftime("%Y-%m-%d")
            daily_map[d_str] = {"cost": 0.0, "activities": []}
            curr += timedelta(days=1)
    except Exception:
        pass

    for stop in trip.stops:
        for sa in stop.activities:
            d_str = sa.date
            if d_str not in daily_map:
                daily_map[d_str] = {"cost": 0.0, "activities": []}
            cost = sa.activity.estimated_cost if sa.activity else 0.0
            act_name = sa.activity.name if sa.activity else "Activity"
            daily_map[d_str]["cost"] += cost
            daily_map[d_str]["activities"].append(act_name)

    sorted_dates = sorted(daily_map.keys())
    return [
        schemas.DailyCost(
            date=d,
            cost=daily_map[d]["cost"],
            activities=daily_map[d]["activities"],
        )
        for d in sorted_dates
    ]
