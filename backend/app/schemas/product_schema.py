import uuid
from decimal import Decimal

from app.models.products import Product
from pydantic import BaseModel


class ProductResponse(BaseModel):
    id: uuid.UUID
    name: str
    price: Decimal
    description: str
    stock_quantity: int


def to_product_reponse(data: Product) -> ProductResponse:
    return ProductResponse(
        id=data.id,
        name=data.name,
        price=data.price,
        description=data.description,
        stock_quantity=data.stock_quantity,
    )
