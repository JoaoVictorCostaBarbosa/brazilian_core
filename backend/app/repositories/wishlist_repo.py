import uuid

from app.models.wishlist_item import WishlistItem
from app.repositories.base import BaseRepository


class WishlistRepository(BaseRepository):
    def add_to_wishlist(self, item: WishlistItem) -> None:
        query = """
            INSERT INTO wishlist (id, user_id, product_id, added_at)
            VALUES (%s, %s, %s, %s)
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(
                query,
                (str(item.id), str(item.user_id), str(item.product_id), item.added_at),
            )

    def get_wishlist(self, user_id: uuid.UUID) -> list[dict]:
        query = """
            SELECT
                w.id,
                w.user_id,
                w.product_id,
                w.added_at,
                p.name,
                p.price,
                p.description,
                p.stock_quantity,
                p.url_img
            FROM wishlist w
            JOIN products p ON p.id = w.product_id
            WHERE w.user_id = %s
            ORDER BY w.added_at DESC
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(user_id),))
            rows = cursor.fetchall()

        return [
            {
                "id": str(row[0]),
                "user_id": str(row[1]),
                "product_id": str(row[2]),
                "added_at": row[3].isoformat(),
                "name": row[4],
                "price": float(row[5]),
                "description": row[6],
                "stock_quantity": row[7],
                "url_img": row[8],
            }
            for row in rows
        ]

    def get_item(self, user_id: uuid.UUID, product_id: uuid.UUID) -> WishlistItem | None:
        query = """
            SELECT id, user_id, product_id, added_at
            FROM wishlist
            WHERE user_id = %s AND product_id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(user_id), str(product_id)))
            row = cursor.fetchone()

        if not row:
            return None

        return WishlistItem(
            id=uuid.UUID(str(row[0])),
            user_id=uuid.UUID(str(row[1])),
            product_id=uuid.UUID(str(row[2])),
            added_at=row[3],
        )

    def remove_from_wishlist(self, user_id: uuid.UUID, product_id: uuid.UUID) -> bool:
        query = """
            DELETE FROM wishlist
            WHERE user_id = %s AND product_id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(user_id), str(product_id)))
            return cursor.rowcount > 0
