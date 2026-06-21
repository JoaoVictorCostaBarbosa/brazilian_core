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
    url_img: str


class ProductRequest(BaseModel):
    name: str
    price: Decimal
    description: str
    stock_quantity: int
    url_img: str

    def to_model(self) -> Product:
        return Product(
            name=self.name,
            price=self.price,
            description=self.description,
            stock_quantity=self.stock_quantity,
            url_img=self.url_img,
            id=None,
        )


class ProductUpdateRequest(BaseModel):
    name: str
    price: Decimal
    description: str
    stock_quantity: int
    url_img: str


def to_product_reponse(data: Product) -> ProductResponse:
    return ProductResponse(
        id=data.id,
        name=data.name,
        price=data.price,
        description=data.description,
        stock_quantity=data.stock_quantity,
        url_img=data.url_img,
    )
