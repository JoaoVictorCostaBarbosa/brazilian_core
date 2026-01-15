import uuid

import psycopg2
from app.db.connection import get_connection
from app.models.order import Order
from app.models.order_purchased import OrderPurchased
from app.models.product_purchased import ProductPurchased


class OrderRepository:
    def create_order(self, order: Order):
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO orders
            (id, user_id, coupon_id, purchase_at)
            VALUES (%s, %s, %s, %s)
        """

        try:
            coupon_id = order.coupon_id
            if coupon_id:
                coupon_id = str(coupon_id)

            cursor.execute(
                query,
                (
                    str(order.id),
                    str(order.user_id),
                    coupon_id,
                    order.purchase_at,
                ),
            )
            conn.commit()

        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def get_order_by_id(self, id: uuid.UUID) -> Order | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
              id,
              user_id,
              coupon_id,
              purchase_at
            FROM orders
            WHERE id = %s
        """

        try:
            cursor.execute(
                query,
                (str(id),),
            )

            row = cursor.fetchone()

            if not row:
                return None

            return Order(
                id=uuid.UUID(row[0]),
                user_id=uuid.UUID(row[1]),
                coupon_id=uuid.UUID(row[2]),
                purchase_at=row[3],
            )

        finally:
            cursor.close()
            conn.close()

    def get_order_resum_by_id(self, id: uuid.UUID) -> OrderPurchased | None:
        conn = get_connection()
        cursor = conn.cursor()

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
                order_id,
                user_id,
                coupon_id,
                order_purchase_at,
                product_id,
                product_name,
                product_price,
                product_description,
                product_url_img,
                product_quantity;
        """

        try:
            cursor.execute(
                query,
                (str(id),),
            )

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

        finally:
            cursor.close()
            conn.close()

    def delete_order(self, id: uuid.UUID):
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            DELETE from orders
            WHERE id = %s
        """

        try:
            cursor.execute(
                query,
                (str(id),),
            )
            conn.commit()

        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()
