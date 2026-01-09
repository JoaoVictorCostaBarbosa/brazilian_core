import uuid

from app.repositories.user_repo import UserRepository
from app.security.jwt import decode_access_token
from fastapi import Depends, HTTPException, Request
from starlette import status


def get_current_user(
    request: Request,
    user_repo: UserRepository = Depends(UserRepository),
):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token não fornecido",
        )

    token = auth_header.split(" ")[1]
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
        )

    user = user_repo.get_user_by_id(uuid.UUID(user_id))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não existe",
        )

    return user
