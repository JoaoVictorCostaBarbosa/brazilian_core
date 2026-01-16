import uuid
from decimal import Decimal

from app.models.item_in_cart import ItemInCart
from pydantic import BaseModel


class ItemInCartResponse(BaseModel):
    id: uuid.UUID
    name: str
    price: Decimal
    quantity: int
    url_img: str


def to_item_in_cart_response(data: ItemInCart) -> ItemInCartResponse:
    return ItemInCartResponse(
        id=data.id,
        name=data.name,
        price=data.price,
        quantity=data.quantity,
        url_img=data.url_img,
    )
