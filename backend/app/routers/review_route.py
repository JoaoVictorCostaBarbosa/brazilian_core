import uuid

from app.models.user import User
from app.repositories.products_repo import ProductRepository
from app.repositories.review_repo import ReviewRepository
from app.schemas.review_schema import (
    ReviewRequest,
    ReviewResponse,
    ReviewUpdateCommentRequest,
    ReviewUpdateRatingRequest,
    to_review_reponse,
)
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

router = APIRouter()


@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def post_review(
    review_data: ReviewRequest,
    current_user: User = Depends(get_current_user),
    review_repo: ReviewRepository = Depends(ReviewRepository),
    product_repo: ProductRepository = Depends(ProductRepository),
):
    product = product_repo.get_product_by_id(review_data.product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado"
        )

    existing_review = review_repo.get_existing_review(
        current_user.id, review_data.product_id
    )

    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Já existe uma review para este produto",
        )

    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Avaliação deve ser um valor entre 1 e 5",
        )

    review = review_data.to_model(current_user.id)

    review_repo.create_review(review)

    return to_review_reponse(review)


@router.get(
    "/{product_id}/product",
    response_model=list[ReviewResponse],
    status_code=status.HTTP_200_OK,
)
def get_product_reviews(
    product_id: uuid.UUID,
    _: User = Depends(get_current_user),
    review_repo: ReviewRepository = Depends(ReviewRepository),
    product_repo: ProductRepository = Depends(ProductRepository),
):
    product = product_repo.get_product_by_id(product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado"
        )

    reviews = review_repo.get_product_reviews(product_id)

    return [to_review_reponse(review) for review in reviews]


@router.get("/me", response_model=list[ReviewResponse], status_code=status.HTTP_200_OK)
def get_user_review(
    current_user: User = Depends(get_current_user),
    review_repo: ReviewRepository = Depends(ReviewRepository),
):
    reviews = review_repo.get_user_reviews(current_user.id)

    return [to_review_reponse(review) for review in reviews]


@router.get(
    "/{review_id}", response_model=ReviewResponse, status_code=status.HTTP_200_OK
)
def get_review_by_id(
    review_id: uuid.UUID,
    _: User = Depends(get_current_user),
    review_repo: ReviewRepository = Depends(ReviewRepository),
):
    review = review_repo.get_review_by_id(review_id)

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review não encontrada"
        )

    return to_review_reponse(review)


@router.patch("/comment", response_model=ReviewResponse, status_code=status.HTTP_200_OK)
def update_review_comment(
    update_data: ReviewUpdateCommentRequest,
    current_user: User = Depends(get_current_user),
    review_repo: ReviewRepository = Depends(ReviewRepository),
):
    review = review_repo.get_review_by_id(update_data.id)

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review não encontrada"
        )

    if current_user.id != review.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente o autor do comentario pode atualizar ele",
        )

    review_repo.update_review_comment(review.comment, update_data.id)

    review.comment = update_data.comment

    return to_review_reponse(review)


@router.patch("/rating", response_model=ReviewResponse, status_code=status.HTTP_200_OK)
def update_review_rating(
    update_data: ReviewUpdateRatingRequest,
    current_user: User = Depends(get_current_user),
    review_repo: ReviewRepository = Depends(ReviewRepository),
):
    review = review_repo.get_review_by_id(update_data.id)

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review não encontrada"
        )

    if current_user.id != review.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente o autor do comentario pode atualizar ele",
        )

    if update_data.rating < 1 or update_data.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Avaliação deve ser um valor entre 1 e 5",
        )

    review_repo.update_review_rating(update_data.rating, update_data.id)

    review.rating = update_data.rating

    return to_review_reponse(review)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    review_repo: ReviewRepository = Depends(ReviewRepository),
):
    review = review_repo.get_review_by_id(id)

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review não encontrada"
        )

    if current_user.id != review.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente o autor do comentario pode deletar ele",
        )

    review_repo.detele_review(id)

    return status.HTTP_204_NO_CONTENT
