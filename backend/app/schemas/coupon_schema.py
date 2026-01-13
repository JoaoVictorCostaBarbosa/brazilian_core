import uuid
from datetime import date

from app.models.coupon import Coupon
from pydantic import BaseModel


class CouponRequest(BaseModel):
    code: str
    discount_percentage: int
    expires_at: date

    def to_model(self) -> Coupon:
        return Coupon(
            code=self.code,
            discout_percentage=self.discount_percentage,
            expires_at=self.expires_at,
        )


class CouponResponse(BaseModel):
    id: uuid.UUID
    code: str
    discount_percentage: int
    expires_at: date

class CouponUpdateRequest(BaseModel):
    id: uuid.UUID
    discount_percentage: int

def to_coupon_reponse(data: Coupon) -> CouponResponse:
    return CouponResponse(
        id=data.id,
        code=data.code,
        discount_percentage=data.discount_percentage,
        expires_at=data.expires_at,
    )
