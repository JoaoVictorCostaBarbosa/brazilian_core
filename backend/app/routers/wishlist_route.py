import uuid

from app.models.user import User
from app.models.wishlist_item import WishlistItem
from app.repositories.products_repo import ProductRepository
from app.repositories.wishlist_repo import WishlistRepository
from app.schemas.wishlist_schema import WishlistItemResponse
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

router = APIRouter()


@router.post("/{product_id}", status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    product_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    wishlist_repo: WishlistRepository = Depends(WishlistRepository),
    product_repo: ProductRepository = Depends(ProductRepository),
):
    if not product_repo.get_product_by_id(product_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado"
        )

    if wishlist_repo.get_item(current_user.id, product_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Produto já está na lista de desejos",
        )

    item = WishlistItem(user_id=current_user.id, product_id=product_id)
    wishlist_repo.add_to_wishlist(item)
    return status.HTTP_201_CREATED


@router.get(
    "/",
    response_model=list[WishlistItemResponse],
    status_code=status.HTTP_200_OK,
)
def get_wishlist(
    current_user: User = Depends(get_current_user),
    wishlist_repo: WishlistRepository = Depends(WishlistRepository),
):
    return wishlist_repo.get_wishlist(current_user.id)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(
    product_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    wishlist_repo: WishlistRepository = Depends(WishlistRepository),
):
    if not wishlist_repo.remove_from_wishlist(current_user.id, product_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado na lista de desejos",
        )
    return status.HTTP_204_NO_CONTENT
