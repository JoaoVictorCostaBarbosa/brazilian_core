import uuid

import psycopg2
from app.db.connection import get_connection
from app.models.cart_item import CartItem
from app.schemas.cart_schema import CartItemResponse, CartResponse


class CartItemRepository:
    def add_cart_item(self, cart_item: CartItem):
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO cart_itens (id, user_id, product_id, quantity)
            VALUES (%s, %s, %s, %s)
        """

        try:
            cursor.execute(
                query,
                (
                    str(cart_item.id),
                    str(cart_item.user_id),
                    str(cart_item.product_id),
                    str(cart_item.quantity),
                ),
            )
            conn.commit()

        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def remove_cart_item(self, user_id: uuid.UUID, product_id: uuid.UUID):
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            DELETE FROM cart_itens
            WHERE user_id = %s AND product_id = %s;
        """

        try:
            cursor.execute(
                query,
                (str(user_id), str(product_id)),
            )
            conn.commit()

        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def get_cart(self, user_id: uuid.UUID) -> CartResponse:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
              p.id,
              p.name,
              p.price,
              p.url_img,
              ci.quantity
            FROM cart_itens ci
            JOIN products p ON p.id = ci.product_id
            WHERE ci.user_id = %s;
        """

        try:
            cursor.execute(query, (str(user_id),))
            rows = cursor.fetchall()

            products = [
                CartItemResponse(
                    id=uuid.UUID(row[0]),
                    name=row[1],
                    price=row[2],
                    quantity=row[4],
                    url_img=row[3],
                )
                for row in rows
            ]

            return CartResponse(products=products)
        finally:
            cursor.close()
            conn.close()

    def get_product_from_cart_by_id(
        self, user_id: uuid.UUID, product_id: uuid.UUID
    ) -> CartItemResponse | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
              p.id,
              p.name,
              p.price,
              p.url_img,
              ci.quantity
            FROM cart_itens ci
            JOIN products p ON p.id = ci.product_id
            WHERE ci.user_id = %s AND ci.product_id = %s;
        """

        try:
            cursor.execute(
                query,
                (
                    str(user_id),
                    str(product_id),
                ),
            )
            row = cursor.fetchone()

            if not row:
                return None

            return CartItemResponse(
                id=uuid.UUID(row[0]),
                name=row[1],
                price=row[2],
                quantity=row[3],
                url_img=row[4],
            )
        finally:
            cursor.close()
            conn.close()
