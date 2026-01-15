import uuid
from datetime import date
from decimal import Decimal

from app.models.order_purchased import OrderPurchased
from app.models.product_purchased import ProductPurchased
from pydantic import BaseModel


class ProductPurchasedResponse(BaseModel):
    id: uuid.UUID
    name: str
    price: Decimal
    description: str
    quantity: int
    url_img: str


class OrderResponse(BaseModel):
    order_id: uuid.UUID
    user_id: uuid.UUID
    order_purchase_at: date
    products_register: list[ProductPurchasedResponse]
    coupon_id: uuid.UUID | None
    purchase_value: Decimal


def to_product_purchased_response(data: ProductPurchased) -> ProductPurchasedResponse:
    return ProductPurchasedResponse(
        id=data.id,
        name=data.name,
        price=data.price,
        description=data.description,
        quantity=data.quantity,
        url_img=data.url_img,
    )


def to_order_response(data: OrderPurchased) -> OrderResponse:
    return OrderResponse(
        order_id=data.order_id,
        user_id=data.user_id,
        order_purchase_at=data.order_purchase_at,
        products_register=[
            to_product_purchased_response(product) for product in data.products_register
        ],
        coupon_id=data.coupon_id,
        purchase_value=data.purchase_value,
    )
