from app.models.product_order import ProductOrder
from app.repositories.base import BaseRepository


class ProductOrderRepository(BaseRepository):
    def create_product_order(self, product_order: ProductOrder) -> None:
        query = """
            INSERT INTO product_order (id, order_id, product_register_id, quantity)
            VALUES (%s, %s, %s, %s)
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(
                query,
                (
                    str(product_order.id),
                    str(product_order.order_id),
                    str(product_order.product_register_id),
                    product_order.quantity,
                ),
            )
