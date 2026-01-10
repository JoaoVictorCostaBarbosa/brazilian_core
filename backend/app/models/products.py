import uuid
from decimal import Decimal

from typing_extensions import Optional


class Product:
    def __init__(
        self,
        name: str,
        price: Decimal,
        description: str,
        stock_quantity: int,
        url_img: str,
        id: Optional[uuid.UUID],
    ) -> None:
        self.id = id or uuid.uuid4()
        self.name = name
        self.price = (price * 10) / 10
        self.description = description
        self.stock_quantity = stock_quantity
        self.url_img = url_img
