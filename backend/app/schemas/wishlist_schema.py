import uuid
from decimal import Decimal

from pydantic import BaseModel


class WishlistItemResponse(BaseModel):
    id: str
    user_id: str
    product_id: str
    added_at: str
    name: str
    price: Decimal
    description: str
    stock_quantity: int
    url_img: str
