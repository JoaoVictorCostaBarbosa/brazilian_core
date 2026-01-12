import uuid
from decimal import Decimal

from pydantic import BaseModel


class CartItemResponse(BaseModel):
    id: uuid.UUID
    name: str
    price: Decimal
    quantity: int
    url_img: str


class CartResponse(BaseModel):
    products: list[CartItemResponse]
