import uuid

from app.models.order import Order
from app.models.order_purchased import OrderPurchased
from app.models.product_purchased import ProductPurchased
from app.repositories.base import BaseRepository


class OrderRepository(BaseRepository):
    def create_order(self, order: Order) -> None:
        query = """
            INSERT INTO orders (id, user_id, coupon_id, purchase_at)
            VALUES (%s, %s, %s, %s)
        """
        coupon_id = str(order.coupon_id) if order.coupon_id else None

        with self._get_cursor() as (conn, cursor):
            cursor.execute(
                query,
                (str(order.id), str(order.user_id), coupon_id, order.purchase_at),
            )

    def get_order_by_id(self, id: uuid.UUID) -> Order | None:
        query = """
            SELECT id, user_id, coupon_id, purchase_at
            FROM orders
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(id),))
            row = cursor.fetchone()

        if not row:
            return None

        return Order(
            id=uuid.UUID(row[0]),
            user_id=uuid.UUID(row[1]),
            coupon_id=uuid.UUID(row[2]) if row[2] else None,
            purchase_at=row[3],
        )

    def get_order_resum_by_id(self, id: uuid.UUID) -> OrderPurchased | None:
        query = """
            SELECT
                order_id,
                user_id,
                coupon_id,
                order_purchase_at,
                product_id,
                product_name,
                product_price,
                product_description,
                product_url_img,
                product_quantity,
                SUM(product_price * product_quantity) AS purchase_value
            FROM vw_order_details
            WHERE order_id = %s
            GROUP BY
                order_id, user_id, coupon_id, order_purchase_at,
                product_id, product_name, product_price,
                product_description, product_url_img, product_quantity
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(id),))
            rows = cursor.fetchall()

        if not rows:
            return None

        coupon_raw = rows[0][2]
        coupon_id = uuid.UUID(coupon_raw) if coupon_raw is not None else None

        return OrderPurchased(
            order_id=uuid.UUID(rows[0][0]),
            user_id=uuid.UUID(rows[0][1]),
            coupon_id=coupon_id,
            order_purchase_at=rows[0][3],
            products_register=[
                ProductPurchased(
                    id=uuid.UUID(row[4]),
                    name=row[5],
                    price=row[6],
                    description=row[7],
                    url_img=row[8],
                    quantity=row[9],
                )
                for row in rows
            ],
            purchase_value=rows[0][10],
        )

    def get_orders_summary_by_user(self, user_id: uuid.UUID):
        query = """
            SELECT
                order_id, user_id, coupon_id, order_purchase_at,
                total_products, total_items, total_value
            FROM vw_order_summary
            WHERE user_id = %s
            ORDER BY order_purchase_at DESC
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(user_id),))
            return cursor.fetchall()

    def delete_order(self, id: uuid.UUID) -> None:
        query = """
            DELETE FROM orders
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(id),))
