import uuid
from decimal import Decimal

from app.models.user import User
from app.repositories.products_repo import ProductRepository
from app.schemas.product_schema import ProductResponse, to_product_reponse
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

router = APIRouter()


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
    products = product_repo.read_products()

    if start < 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="indice de inicio da paginação deve ser positivo",
        )

    products = products[start:end]

    return [to_product_reponse(product) for product in products]
