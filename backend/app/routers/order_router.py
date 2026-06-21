from typing import Optional

from app.models.user import User
from app.repositories.cart_item_repo import CartItemRepository
from app.repositories.coupon_repo import CouponRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.product_order_repo import ProductOrderRepository
from app.repositories.product_register_repo import ProductRegisterRepository
from app.schemas.order_schema import OrderResponse, to_order_response
from app.security.auth import get_current_user
from app.services.order_service import OrderService
from fastapi import APIRouter, Depends
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


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def purchase_from_cart(
    coupon_code: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    service: OrderService = Depends(get_order_service),
):
    result = service.purchase_from_cart(current_user, coupon_code)
    return to_order_response(result)
