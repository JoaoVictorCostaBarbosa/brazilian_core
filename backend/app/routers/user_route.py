from app.models.user import User
from app.schemas.user_schema import UserResponse, to_user_response
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends
from starlette import status

router = APIRouter()


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_current_user_route(current_user: User = Depends(get_current_user)):
    return to_user_response(current_user)

