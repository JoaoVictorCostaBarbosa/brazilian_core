import uuid
from datetime import datetime
from typing import Optional


class WishlistItem:
    def __init__(
        self,
        user_id: uuid.UUID,
        product_id: uuid.UUID,
        id: Optional[uuid.UUID] = None,
        added_at: Optional[datetime] = None,
    ) -> None:
        self.id = id or uuid.uuid4()
        self.user_id = user_id
        self.product_id = product_id
        self.added_at = added_at or datetime.now()
