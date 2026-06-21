from datetime import date
from typing import Optional

from app.discount.strategy import get_discount_strategy
from app.models.order import Order
from app.models.order_purchased import OrderPurchased
from app.models.product_order import ProductOrder
from app.models.user import User
from app.repositories.cart_item_repo import CartItemRepository
from app.repositories.coupon_repo import CouponRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.product_order_repo import ProductOrderRepository
from app.repositories.product_register_repo import ProductRegisterRepository
from fastapi import HTTPException
from starlette import status


class OrderService:
    """
    Facade Pattern — encapsula toda a complexidade do fluxo de compra
    (validar carrinho, aplicar desconto, criar pedido, registrar produtos,
    limpar carrinho) por trás de uma interface simples: purchase_from_cart().

    O router não precisa conhecer nenhum dos repositórios individualmente.
    """

    def __init__(
        self,
        order_repo: OrderRepository,
        product_order_repo: ProductOrderRepository,
        product_register_repo: ProductRegisterRepository,
        cart_item_repo: CartItemRepository,
        coupon_repo: CouponRepository,
    ) -> None:
        self._order_repo = order_repo
        self._product_order_repo = product_order_repo
        self._product_register_repo = product_register_repo
        self._cart_item_repo = cart_item_repo
        self._coupon_repo = coupon_repo

    def purchase_from_cart(
        self, user: User, coupon_code: Optional[str] = None
    ) -> OrderPurchased:
        products = self._cart_item_repo.get_cart(user.id)

        if not products:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Não é possivel realizar uma compra com o carrinho vazio",
            )

        coupon = None
        if coupon_code:
            coupon = self._coupon_repo.get_coupon_by_code(coupon_code)
            if not coupon:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Cupom inválido",
                )

            expires = coupon.expires_at.date() if hasattr(coupon.expires_at, "date") else coupon.expires_at
            if expires < date.today():
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="Cupom expirado",
                )

        discount = get_discount_strategy(coupon)
        order = Order(user.id, coupon_id=coupon.id if coupon else None)
        self._order_repo.create_order(order)

        for product in products:
            product.price = discount.apply(product.price)

            product_register_id = self._product_register_repo.create_product_register(
                product.id, order.id
            )
            if not product_register_id:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Produto não encontrado",
                )

            self._product_order_repo.create_product_order(
                ProductOrder(order.id, product_register_id, product.quantity)
            )

        result = self._order_repo.get_order_resum_by_id(order.id)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Erro ao finalizar a compra",
            )

        self._cart_item_repo.clear_user_cart(user.id)
        return result
