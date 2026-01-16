import uuid
from enum import Enum

from typing_extensions import Optional


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"


class User:
    def __init__(
        self,
        name: str,
        email: str,
        password: str,
        id: Optional[uuid.UUID] = None,
        role: Optional[UserRole] = None,
    ) -> None:
        self.id = id or uuid.uuid4()
        self.name = name
        self.email = email
        self.password = password
        self.role = role
