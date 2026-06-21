import uuid
from typing import Optional

from app.models.user import User
from app.repositories.cart_item_repo import CartItemRepository
from app.repositories.coupon_repo import CouponRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.product_order_repo import ProductOrderRepository
from app.repositories.product_register_repo import ProductRegisterRepository
from app.schemas.order_schema import OrderResponse, OrderSummaryResponse, to_order_response
from app.security.auth import get_current_user
from app.services.order_service import OrderService
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

router = APIRouter()


def get_order_service(
    order_repo: OrderRepository = Depends(OrderRepository),
    product_order_repo: ProductOrderRepository = Depends(ProductOrderRepository),
    product_register_repo: ProductRegisterRepository = Depends(ProductRegisterRepository),
    cart_item_repo: CartItemRepository = Depends(CartItemRepository),
    coupon_repo: CouponRepository = Depends(CouponRepository),
) -> OrderService:
    return OrderService(
        order_repo=order_repo,
        product_order_repo=product_order_repo,
        product_register_repo=product_register_repo,
        cart_item_repo=cart_item_repo,
        coupon_repo=coupon_repo,
    )


@router.get("/", response_model=list[OrderSummaryResponse], status_code=status.HTTP_200_OK)
def list_user_orders(
    current_user: User = Depends(get_current_user),
    order_repo: OrderRepository = Depends(OrderRepository),
):
    rows = order_repo.get_orders_summary_by_user(current_user.id)
    return [
        OrderSummaryResponse(
            order_id=uuid.UUID(row[0]),
            user_id=uuid.UUID(row[1]),
            coupon_id=uuid.UUID(row[2]) if row[2] else None,
            order_purchase_at=row[3],
            total_products=row[4],
            total_items=row[5],
            total_value=row[6],
        )
        for row in rows
    ]


@router.get("/{order_id}", response_model=OrderResponse, status_code=status.HTTP_200_OK)
def get_order_detail(
    order_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    order_repo: OrderRepository = Depends(OrderRepository),
):
    order = order_repo.get_order_resum_by_id(order_id)

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pedido não encontrado"
        )

    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado",
        )

    return to_order_response(order)


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def purchase_from_cart(
    coupon_code: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    service: OrderService = Depends(get_order_service),
):
    result = service.purchase_from_cart(current_user, coupon_code)
    return to_order_response(result)
