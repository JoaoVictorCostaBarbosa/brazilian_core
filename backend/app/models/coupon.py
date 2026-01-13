import uuid
from datetime import date
from typing import Optional


class Coupon:
    def __init__(
        self,
        code: str,
        discout_percentage: int,
        expires_at: date,
        id: Optional[uuid.UUID] = None,
    ) -> None:
        self.id = id or uuid.uuid4()
        self.code = code
        self.discount_percentage = discout_percentage
        self.expires_at = expires_at
