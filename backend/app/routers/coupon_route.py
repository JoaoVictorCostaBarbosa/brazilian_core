import uuid

from app.models.user import User, UserRole
from app.repositories.coupon_repo import CouponRepository
from app.schemas.coupon_schema import (
    CouponRequest,
    CouponResponse,
    CouponUpdateRequest,
    to_coupon_reponse,
)
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

router = APIRouter()


@router.post("/", response_model=CouponResponse, status_code=status.HTTP_201_CREATED)
def create_coupon(
    coupon_data: CouponRequest,
    current_user: User = Depends(get_current_user),
    coupon_repo: CouponRepository = Depends(CouponRepository),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente admins podem criar cupons",
        )

    existing_coupon = coupon_repo.get_coupon_by_code(coupon_data.code)

    if existing_coupon:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe um cupom com esse código",
        )
    
    if coupon_data.discount_percentage < 1 and coupon_data.discount_percentage > 100:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="A porcentagem de disconto deve ser entre 0% e 100%",
        )

    coupon = coupon_data.to_model()

    coupon_repo.create_coupon(coupon)

    return to_coupon_reponse(coupon)


@router.get("/", response_model=list[CouponResponse], status_code=status.HTTP_200_OK)
def read_coupons(
    _: User = Depends(get_current_user),
    coupon_repo: CouponRepository = Depends(CouponRepository),
):
    coupons = coupon_repo.get_all_coupons()

    return [to_coupon_reponse(coupon) for coupon in coupons]


@router.get("/{code}", response_model=CouponResponse, status_code=status.HTTP_200_OK)
def get_coupon(
    code: str,
    _: User = Depends(get_current_user),
    coupon_repo: CouponRepository = Depends(CouponRepository),
):
    coupon = coupon_repo.get_coupon_by_code(code)

    if not coupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cupom não encontrado"
        )

    return to_coupon_reponse(coupon)


@router.patch("/", response_model=CouponResponse, status_code=status.HTTP_200_OK)
def update_coupon_discount(
    update_data: CouponUpdateRequest,
    current_user: User = Depends(get_current_user),
    coupon_repo: CouponRepository = Depends(CouponRepository),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente admins podem atualizar cupons",
        )

    if update_data.discount_percentage < 1 and update_data.discount_percentage > 100:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="A porcentagem de disconto deve ser entre 1% e 100%",
        )

    coupon = coupon_repo.update_coupon_discount(
        update_data.discount_percentage, update_data.id
    )

    if not coupon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cupom não encontrado"
        )

    return to_coupon_reponse(coupon)


@router.delete("/{coupon_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_coupon(
    coupon_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    coupon_repo: CouponRepository = Depends(CouponRepository),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente admins podem apagar cupons",
        )

    if not coupon_repo.delete_coupon(coupon_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Cupom não encontrado"
        )

    return status.HTTP_204_NO_CONTENT
