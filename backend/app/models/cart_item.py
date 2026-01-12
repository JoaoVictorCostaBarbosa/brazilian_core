import uuid
from typing import Optional


class CartItem:
    def __init__(
        self,
        user_id: uuid.UUID,
        product_id: uuid.UUID,
        id: Optional[uuid.UUID] = None,
        quantity: Optional[int] = None,
    ) -> None:
        self.id = id or uuid.uuid4()
        self.user_id = user_id
        self.product_id = product_id
        self.quantity = quantity or 1
