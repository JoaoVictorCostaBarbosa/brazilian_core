import uuid

from app.models.user import User, UserRole
from app.repositories.user_repo import UserRepository
from app.schemas.admin_users_schema import AdminUserResponse, UpdateRoleRequest
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

router = APIRouter()


def _require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente admins podem gerenciar usuários",
        )
    return current_user


@router.get(
    "/",
    response_model=list[AdminUserResponse],
    status_code=status.HTTP_200_OK,
)
def list_users(
    _: User = Depends(_require_admin),
    user_repo: UserRepository = Depends(UserRepository),
):
    users = user_repo.list_all_users()
    return [
        AdminUserResponse(id=u.id, name=u.name, email=u.email, role=u.role)
        for u in users
    ]


@router.patch(
    "/{user_id}/role",
    response_model=AdminUserResponse,
    status_code=status.HTTP_200_OK,
)
def update_role(
    user_id: uuid.UUID,
    body: UpdateRoleRequest,
    current_admin: User = Depends(_require_admin),
    user_repo: UserRepository = Depends(UserRepository),
):
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Você não pode alterar sua própria role",
        )

    user = user_repo.update_user_role(user_id, body.role.value)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado"
        )

    return AdminUserResponse(id=user.id, name=user.name, email=user.email, role=user.role)
