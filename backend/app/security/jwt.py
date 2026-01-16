from datetime import datetime, timedelta, timezone

from app.config import settings
from jose import JWTError, jwt


def create_access_token(subject: str) -> str:
    expire = datetime.now(tz=timezone.utc) + timedelta(
        seconds=settings.JWT_EXPIRES_IN_SECONDS
    )

    payload = {
        "sub": subject,
        "exp": expire,
    }

    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except JWTError:
        return {}
