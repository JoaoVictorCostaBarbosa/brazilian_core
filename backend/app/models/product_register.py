import uuid
from decimal import Decimal
from typing import Optional


class ProductRegister:
    def __init__(
        self,
        name: str,
        price: Decimal,
        description: str,
        url_img: str,
        id: Optional[uuid.UUID],
    ) -> None:
        self.id = id or uuid.uuid4()
        self.name = name
        self.price = price
        self.description = description
        self.url_img = url_img
