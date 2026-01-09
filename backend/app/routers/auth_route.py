from app.repositories.user_repo import UserRepository
from app.schemas.user_schema import (
    AuthResponse,
    UserCreate,
    UserLogin,
    to_user_response,
)
from app.security.jwt import create_access_token
from app.security.password import hash_password, verify_password
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

router = APIRouter()


@router.post(
    "/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED
)
def register(
    user_data: UserCreate, user_repo: UserRepository = Depends(UserRepository)
):
    existing_user = user_repo.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Email já utilizado"
        )

    user = user_data.to_model()
    user.password = hash_password(user.password)
    user_repo.create_user(user)

    token = create_access_token(str(user.id))

    response = AuthResponse(user=to_user_response(user), token=token)

    return response


@router.post("/login", response_model=AuthResponse, status_code=status.HTTP_200_OK)
def login(user_data: UserLogin, user_repo: UserRepository = Depends(UserRepository)):
    user = user_repo.get_user_by_email(user_data.email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas"
        )

    if not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciais inválidas"
        )

    token = create_access_token(str(user.id))

    response = AuthResponse(user=to_user_response(user), token=token)

    return response
