import uuid

from app.models.user import UserRole
from pydantic import BaseModel


class AdminUserResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    role: UserRole


class UpdateRoleRequest(BaseModel):
    role: UserRole
