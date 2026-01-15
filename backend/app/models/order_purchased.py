import uuid
from datetime import date
from decimal import Decimal

from app.models.product_purchased import ProductPurchased


class OrderPurchased:
    def __init__(
        self,
        order_id: uuid.UUID,
        user_id: uuid.UUID,
        order_purchase_at: date,
        products_register: list[ProductPurchased],
        coupon_id: uuid.UUID | None,
        purchase_value: Decimal,
    ) -> None:
        self.order_id = order_id
        self.user_id = user_id
        self.order_purchase_at = order_purchase_at
        self.products_register = products_register
        self.coupon_id = coupon_id
        self.purchase_value = purchase_value
