import uuid
from typing import Optional


class ProductOrder:
    def __init__(
        self,
        order_id: uuid.UUID,
        product_register_id: uuid.UUID,
        quantity: int,
        id: Optional[uuid.UUID] = None,
    ) -> None:
        self.id = id or uuid.uuid4()
        self.order_id = order_id
        self.product_register_id = product_register_id
        self.quantity = quantity
