import uuid
from datetime import date
from typing import Optional


class Order:
    def __init__(
        self,
        user_id: uuid.UUID,
        id: Optional[uuid.UUID] = None,
        coupon_id: Optional[uuid.UUID] = None,
        purchase_at: Optional[date] = date.today(),
    ) -> None:
        self.id = id or uuid.uuid4()
        self.user_id = user_id
        self.coupon_id = coupon_id
        self.purchase_at = purchase_at
