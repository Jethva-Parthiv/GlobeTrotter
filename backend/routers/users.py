from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from dependencies import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


def serialize_user(user: models.User) -> schemas.UserOut:
    return schemas.UserOut(
        id=user.id,
        email=user.email,
        name=user.name,
        photo_url=user.photo_url,
        language_preference=user.language_preference,
        is_admin=user.is_admin,
        created_at=user.created_at.isoformat() + "Z" if user.created_at else "",
    )


@router.get("/me", response_model=schemas.UserOut)
def get_profile(current_user: models.User = Depends(get_current_user)):
    return serialize_user(current_user)


@router.patch("/me", response_model=schemas.UserOut)
def update_profile(
    payload: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if payload.email and payload.email != current_user.email:
        existing = db.query(models.User).filter(models.User.email == payload.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already in use",
            )
        current_user.email = payload.email

    if payload.name is not None:
        current_user.name = payload.name
    if payload.photo_url is not None:
        current_user.photo_url = payload.photo_url
    if payload.language_preference is not None:
        current_user.language_preference = payload.language_preference

    db.commit()
    db.refresh(current_user)
    return serialize_user(current_user)


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db.delete(current_user)
    db.commit()
    return None
