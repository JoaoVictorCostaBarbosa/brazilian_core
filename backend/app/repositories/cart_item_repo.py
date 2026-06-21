import uuid

from app.models.cart_item import CartItem
from app.models.item_in_cart import ItemInCart
from app.repositories.base import BaseRepository


class CartItemRepository(BaseRepository):
    def add_cart_item(self, cart_item: CartItem) -> None:
        query = """
            INSERT INTO cart_itens (id, user_id, product_id, quantity)
            VALUES (%s, %s, %s, %s)
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(
                query,
                (
                    str(cart_item.id),
                    str(cart_item.user_id),
                    str(cart_item.product_id),
                    str(cart_item.quantity),
                ),
            )

    def remove_cart_item(self, user_id: uuid.UUID, product_id: uuid.UUID) -> None:
        query = """
            DELETE FROM cart_itens
            WHERE user_id = %s AND product_id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(user_id), str(product_id)))

    def get_cart(self, user_id: uuid.UUID) -> list[ItemInCart]:
        query = """
            SELECT p.id, p.name, p.price, p.url_img, ci.quantity
            FROM cart_itens ci
            JOIN products p ON p.id = ci.product_id
            WHERE ci.user_id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(user_id),))
            rows = cursor.fetchall()

        return [
            ItemInCart(
                id=uuid.UUID(row[0]),
                name=row[1],
                price=row[2],
                url_img=row[3],
                quantity=row[4],
            )
            for row in rows
        ]

    def get_product_from_cart_by_id(
        self, user_id: uuid.UUID, product_id: uuid.UUID
    ) -> ItemInCart | None:
        query = """
            SELECT p.id, p.name, p.price, p.url_img, ci.quantity
            FROM cart_itens ci
            JOIN products p ON p.id = ci.product_id
            WHERE ci.user_id = %s AND ci.product_id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(user_id), str(product_id)))
            row = cursor.fetchone()

        if not row:
            return None

        return ItemInCart(
            id=uuid.UUID(row[0]),
            name=row[1],
            price=row[2],
            url_img=row[3],
            quantity=row[4],
        )

    def clear_user_cart(self, user_id: uuid.UUID) -> None:
        # Reset quantities to 1 first so the decrement trigger allows the DELETE
        with self._get_cursor() as (conn, cursor):
            cursor.execute(
                "UPDATE cart_itens SET quantity = 1 WHERE user_id = %s",
                (str(user_id),),
            )
            cursor.execute(
                "DELETE FROM cart_itens WHERE user_id = %s",
                (str(user_id),),
            )
