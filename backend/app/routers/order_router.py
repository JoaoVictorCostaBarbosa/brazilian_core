from app.models.order import Order
from app.models.product_order import ProductOrder
from app.models.user import User
from app.repositories.cart_item_repo import CartItemRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.product_order_repo import ProductOrderRepository
from app.repositories.product_register_repo import ProductRegisterRepository
from app.schemas.order_schema import OrderResponse, to_order_response
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from starlette import status

router = APIRouter()


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def purchase_from_cart(
    current_user: User = Depends(get_current_user),
    order_repo: OrderRepository = Depends(OrderRepository),
    product_order_repo: ProductOrderRepository = Depends(ProductOrderRepository),
    product_register_repo: ProductRegisterRepository = Depends(
        ProductRegisterRepository
    ),
    cart_item_repo: CartItemRepository = Depends(CartItemRepository),
):
    products = cart_item_repo.get_cart(current_user.id)

    if not products[0]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Não é possivel realziar uma compra com o carrinho vazio",
        )

    order = Order(current_user.id)

    order_repo.create_order(order)

    for p in products:
        product_register_id = product_register_repo.create_product_register(
            p.id, order.id
        )

        if not product_register_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado"
            )

        product_order_repo.create_product_order(
            ProductOrder(order.id, product_register_id, p.quantity)
        )

    result = order_repo.get_order_resum_by_id(order.id)

    if not result:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao finalizar a compra",
        )

    cart_item_repo.clear_user_cart(current_user.id)

    return to_order_response(result)
