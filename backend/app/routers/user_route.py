from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.schemas.user_schema import UserResponse, to_user_response
from app.security.auth import get_current_user
from app.security.password import hash_password
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

router = APIRouter()


@router.get("/me", response_model=UserResponse, status_code=status.HTTP_200_OK)
def get_current_user_route(current_user: User = Depends(get_current_user)):
    return to_user_response(current_user)


@router.patch("/me/{password}/password", status_code=status.HTTP_200_OK)
def update_password(
    password: str,
    current_user: User = Depends(get_current_user),
    user_repo: UserRepository = Depends(UserRepository),
):
    p = hash_password(password)
    user = user_repo.update_user_password(current_user.id, p)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado"
        )

    return to_user_response(user)


@router.patch("/me/{email}/email", status_code=status.HTTP_200_OK)
def update_email(
    email: str,
    current_user: User = Depends(get_current_user),
    user_repo: UserRepository = Depends(UserRepository),
):
    user = user_repo.update_user_email(current_user.id, email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado"
        )

    return to_user_response(user)


@router.patch("/me/{name}/name", status_code=status.HTTP_200_OK)
def update_name(
    name: str,
    current_user: User = Depends(get_current_user),
    user_repo: UserRepository = Depends(UserRepository),
):
    user = user_repo.update_user_name(current_user.id, name)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado"
        )

    return to_user_response(user)
