from decimal import Decimal

from pydantic import BaseModel


class OverviewResponse(BaseModel):
    total_orders: int
    total_revenue: Decimal
    avg_ticket: Decimal
    total_users: int
    out_of_stock: int
    low_stock: int


class TopProductResponse(BaseModel):
    product_id: str
    product_name: str
    product_url_img: str
    total_sold: int
    total_revenue: Decimal


class RevenueDayResponse(BaseModel):
    day: str
    revenue: Decimal
    orders_count: int
