import hmac
import os
import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from auth import create_access_token, hash_password, verify_password
from database.db import get_db
from database.models import User


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

VALID_ROLES = {"Citizen", "Control Officer"}
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class Credentials(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    password: str = Field(min_length=10, max_length=128)
    role: str


class Registration(Credentials):
    officer_invite_code: str | None = Field(default=None, max_length=256)


def normalize_and_validate_email(email: str) -> str:
    normalized_email = email.strip().lower()
    if not EMAIL_PATTERN.fullmatch(normalized_email):
        raise HTTPException(status_code=422, detail="Enter a valid email address.")
    return normalized_email


def auth_response(user: User) -> dict:
    return {
        "access_token": create_access_token(user),
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
        },
    }


@router.post("/register")
def register(
    payload: Registration,
    db: Session = Depends(get_db),
):
    if payload.role not in VALID_ROLES:
        raise HTTPException(
            status_code=422,
            detail="Choose Citizen or Control Officer.",
        )

    email = normalize_and_validate_email(payload.email)
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    if payload.role == "Control Officer":
        invite_code = os.getenv("OFFICER_INVITE_CODE")
        if not invite_code:
            raise HTTPException(
                status_code=503,
                detail="Officer registration is disabled until OFFICER_INVITE_CODE is configured.",
            )
        if payload.officer_invite_code is None or not hmac.compare_digest(
            payload.officer_invite_code.encode("utf-8"),
            invite_code.encode("utf-8"),
        ):
            raise HTTPException(status_code=403, detail="The officer invite code is invalid.")

    user = User(
        email=email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="An account with this email already exists.")
    db.refresh(user)
    return auth_response(user)


@router.post("/login")
def login(
    payload: Credentials,
    db: Session = Depends(get_db),
):
    if payload.role not in VALID_ROLES:
        raise HTTPException(status_code=422, detail="Choose Citizen or Control Officer.")

    email = normalize_and_validate_email(payload.email)
    user = db.query(User).filter(User.email == email).first()
    if (
        user is None
        or user.role != payload.role
        or not verify_password(payload.password, user.password_hash)
    ):
        raise HTTPException(status_code=401, detail="Email or password is incorrect.")

    return auth_response(user)
