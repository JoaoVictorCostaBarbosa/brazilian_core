import uuid
from datetime import date

from app.models.review import Review
from pydantic import BaseModel


class ReviewRequest(BaseModel):
    product_id: uuid.UUID
    comment: str
    rating: int

    def to_model(self, user_id: uuid.UUID) -> Review:
        return Review(
            user_id=user_id,
            product_id=self.product_id,
            rating=self.rating,
            comment=self.comment,
        )


class ReviewResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    product_id: uuid.UUID
    comment: str
    rating: int
    created_at: date


class ReviewUpdateCommentRequest(BaseModel):
    id: uuid.UUID
    comment: str


class ReviewUpdateRatingRequest(BaseModel):
    id: uuid.UUID
    rating: int


def to_review_reponse(data: Review) -> ReviewResponse:
    return ReviewResponse(
        id=data.id,
        user_id=data.user_id,
        product_id=data.product_id,
        comment=data.comment,
        rating=data.rating,
        created_at=data.created_at,
    )
