import uuid

from app.models.cart_item import CartItem
from app.models.user import User
from app.repositories.cart_item_repo import CartItemRepository
from app.repositories.products_repo import ProductRepository
from app.schemas.cart_schema import CartResponse
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

router = APIRouter()


@router.post("/{product_id}", status_code=status.HTTP_201_CREATED)
def add_product_to_cart(
    product_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    cart_item_repo: CartItemRepository = Depends(CartItemRepository),
    product_repo: ProductRepository = Depends(ProductRepository),
):
    product = product_repo.get_product_by_id(product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado"
        )

    cart_item = CartItem(current_user.id, product_id)

    cart_item_repo.add_cart_item(cart_item)

    return status.HTTP_201_CREATED


@router.get("/", response_model=CartResponse, status_code=status.HTTP_200_OK)
def get_cart(
    current_user: User = Depends(get_current_user),
    cart_item_repo: CartItemRepository = Depends(CartItemRepository),
):
    return cart_item_repo.get_cart(current_user.id)


@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
def remove_product_from_cart(
    product_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    cart_item_repo: CartItemRepository = Depends(CartItemRepository),
):
    product = cart_item_repo.get_product_from_cart_by_id(current_user.id, product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado"
        )

    cart_item_repo.remove_cart_item(current_user.id, product_id)

    return status.HTTP_200_OK
