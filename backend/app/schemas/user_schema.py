import uuid

from app.models.user import User
from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    password: str

    def to_model(self) -> User:
        return User(name=self.name, email=self.email, password=self.password)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str


class AuthResponse(BaseModel):
    user: UserResponse
    token: str


def to_user_response(data: User) -> UserResponse:
    return UserResponse(id=data.id, name=data.name, email=data.email)
