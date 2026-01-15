import uuid
from decimal import Decimal


class ProductPurchased:
    def __init__(
        self,
        id: uuid.UUID,
        name: str,
        price: Decimal,
        description: str,
        quantity: int,
        url_img: str,
    ) -> None:
        self.id = id
        self.name = name
        self.price = price
        self.description = description
        self.quantity = quantity
        self.url_img = url_img
