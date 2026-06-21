import uuid
from decimal import Decimal

from app.models.user import User, UserRole
from app.repositories.products_repo import ProductRepository
from app.schemas.product_schema import (
    ProductRequest,
    ProductResponse,
    ProductUpdateRequest,
    to_product_reponse,
)
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException, Query
from starlette import status

router = APIRouter()


@router.get(
    "/filter",
    response_model=list[ProductResponse],
    status_code=status.HTTP_200_OK,
)
def filter_products(
    name: str | None = Query(default=None),
    max_price: Decimal | None = Query(default=None),
    min_rating: float | None = Query(default=None, ge=1, le=5),
    in_stock: bool = Query(default=False),
    product_repo: ProductRepository = Depends(ProductRepository),
    _: User = Depends(get_current_user),
):
    products = product_repo.filter_products(name, max_price, min_rating, in_stock)
    return [to_product_reponse(p) for p in products]


@router.get(
    "/search",
    response_model=list[ProductResponse],
    status_code=status.HTTP_200_OK,
)
def search_products(
    name: str,
    product_repo: ProductRepository = Depends(ProductRepository),
    _: User = Depends(get_current_user),
):
    products = product_repo.search_by_name(name)
    return [to_product_reponse(p) for p in products]


@router.get(
    "/price/{price}",
    response_model=list[ProductResponse],
    status_code=status.HTTP_200_OK,
)
def get_product_by_price(
    price: Decimal,
    product_repo: ProductRepository = Depends(ProductRepository),
    _: User = Depends(get_current_user),
):
    products = product_repo.get_product_by_price(price)
    return [to_product_reponse(product) for product in products]


@router.get(
    "/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK
)
def get_product_by_id(
    product_id: uuid.UUID,
    product_repo: ProductRepository = Depends(ProductRepository),
    _: User = Depends(get_current_user),
):
    product = product_repo.get_product_by_id(product_id)

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado"
        )

    return to_product_reponse(product)


@router.get(
    "/{start}/{end}",
    response_model=list[ProductResponse],
    status_code=status.HTTP_200_OK,
)
def read_products(
    start: int,
    end: int,
    product_repo: ProductRepository = Depends(ProductRepository),
    _: User = Depends(get_current_user),
):
    if start < 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="indice de inicio da paginação deve ser positivo",
        )

    products = product_repo.read_products()
    products = products[start:end]
    return [to_product_reponse(product) for product in products]


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_data: ProductRequest,
    current_user: User = Depends(get_current_user),
    product_repo: ProductRepository = Depends(ProductRepository),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente admins podem cadastrar produtos",
        )

    product = product_data.to_model()
    product_repo.create_product(product)
    return to_product_reponse(product)


@router.patch(
    "/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK
)
def update_product(
    product_id: uuid.UUID,
    update_data: ProductUpdateRequest,
    current_user: User = Depends(get_current_user),
    product_repo: ProductRepository = Depends(ProductRepository),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente admins podem editar produtos",
        )

    product = product_repo.update_product(
        product_id,
        update_data.name,
        update_data.price,
        update_data.description,
        update_data.stock_quantity,
        update_data.url_img,
    )

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado"
        )

    return to_product_reponse(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    product_repo: ProductRepository = Depends(ProductRepository),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Somente admins podem excluir produtos",
        )

    if not product_repo.delete_product(product_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado"
        )

    return status.HTTP_204_NO_CONTENT
