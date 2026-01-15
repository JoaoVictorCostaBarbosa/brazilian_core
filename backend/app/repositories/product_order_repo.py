import psycopg2
from app.db.connection import get_connection
from app.models.product_order import ProductOrder


class ProductOrderRepository:
    def create_product_order(self, product_order: ProductOrder):
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO product_order
            (id, order_id, product_register_id, quantity)
            VALUES (%s, %s, %s, %s)
        """

        try:
            cursor.execute(
                query,
                (
                    str(product_order.id),
                    str(product_order.order_id),
                    str(product_order.product_register_id),
                    product_order.quantity,
                ),
            )
            conn.commit()

        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()
