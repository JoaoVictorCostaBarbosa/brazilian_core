import uuid
from datetime import date
from typing import Optional


class Review:
    def __init__(
        self,
        user_id: uuid.UUID,
        product_id: uuid.UUID,
        rating: int,
        comment: str,
        id: Optional[uuid.UUID] = None,
        created_at: Optional[date] = None,
    ) -> None:
        self.id = id or uuid.uuid4()
        self.user_id = user_id
        self.product_id = product_id
        self.rating = rating
        self.comment = comment
        self.created_at = created_at or date.today()
