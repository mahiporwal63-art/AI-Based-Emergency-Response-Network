import base64
import hashlib
import hmac
import logging
import os
import secrets
import time

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from database.db import get_db
from database.models import User


logger = logging.getLogger(__name__)
_configured_secret = os.getenv("AUTH_SECRET")
if _configured_secret:
    _token_secret = _configured_secret.encode("utf-8")
else:
    _token_secret = secrets.token_bytes(32)
    logger.warning(
        "AUTH_SECRET is not set; login sessions will be invalidated when the server restarts."
    )

_bearer = HTTPBearer(auto_error=False)
_PASSWORD_ITERATIONS = 310_000
_TOKEN_LIFETIME_SECONDS = 12 * 60 * 60


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        _PASSWORD_ITERATIONS,
    )
    return (
        f"{_PASSWORD_ITERATIONS}:"
        f"{base64.urlsafe_b64encode(salt).decode('ascii')}:"
        f"{base64.urlsafe_b64encode(digest).decode('ascii')}"
    )


def verify_password(password: str, encoded_hash: str) -> bool:
    iterations_text, salt_text, digest_text = encoded_hash.split(":", 2)
    iterations = int(iterations_text)
    salt = base64.urlsafe_b64decode(salt_text.encode("ascii"))
    expected_digest = base64.urlsafe_b64decode(digest_text.encode("ascii"))
    candidate = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        iterations,
    )
    return hmac.compare_digest(candidate, expected_digest)


def create_access_token(user: User) -> str:
    expires_at = int(time.time()) + _TOKEN_LIFETIME_SECONDS
    payload = f"{user.id}:{expires_at}".encode("ascii")
    encoded_payload = base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")
    signature = hmac.new(_token_secret, encoded_payload.encode("ascii"), hashlib.sha256)
    return f"{encoded_payload}.{signature.hexdigest()}"


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(
        status_code=401,
        detail="Sign in to access this endpoint.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized

    try:
        encoded_payload, supplied_signature = credentials.credentials.split(".", 1)
        if not encoded_payload.isascii() or not supplied_signature.isascii():
            raise unauthorized
        payload = base64.urlsafe_b64decode(
            encoded_payload + "=" * (-len(encoded_payload) % 4)
        ).decode("ascii")
        user_id_text, expires_text = payload.split(":", 1)
        user_id = int(user_id_text)
        expires_at = int(expires_text)
    except (ValueError, UnicodeDecodeError, UnicodeEncodeError):
        raise unauthorized

    expected_signature = hmac.new(
        _token_secret,
        encoded_payload.encode("ascii"),
        hashlib.sha256,
    ).hexdigest()
    if (
        not hmac.compare_digest(
            supplied_signature.encode("ascii"),
            expected_signature.encode("ascii"),
        )
        or expires_at <= int(time.time())
    ):
        raise unauthorized

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise unauthorized
    return user


def require_role(role: str):
    def role_dependency(user: User = Depends(get_current_user)) -> User:
        if user.role != role:
            raise HTTPException(
                status_code=403,
                detail=f"This endpoint requires the {role} role.",
            )
        return user

    return role_dependency
