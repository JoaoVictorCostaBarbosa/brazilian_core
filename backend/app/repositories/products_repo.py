import uuid
from decimal import Decimal
from typing import Tuple

from app.models.products import Product
from app.repositories.base import BaseRepository


class ProductRepository(BaseRepository):
    def read_products(self) -> list[Product]:
        query = """
            SELECT id, name, price, description, stock_quantity, url_img
            FROM products
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query)
            rows = cursor.fetchall()

        return [self._row_to_product(row) for row in rows]

    def get_product_by_id(self, product_id: uuid.UUID) -> Product | None:
        query = """
            SELECT id, name, price, description, stock_quantity, url_img
            FROM products
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(product_id),))
            row = cursor.fetchone()

        if not row:
            return None

        return self._row_to_product(row)

    def get_product_by_price(self, price: Decimal) -> list[Product]:
        query = """
            SELECT id, name, price, description, stock_quantity, url_img
            FROM products
            WHERE price <= %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (price,))
            rows = cursor.fetchall()

        return [self._row_to_product(row) for row in rows]

    def _row_to_product(self, row: Tuple[str, str, Decimal, str, int, str]) -> Product:
        return Product(
            id=uuid.UUID(row[0]),
            name=row[1],
            price=row[2],
            description=row[3],
            stock_quantity=row[4],
            url_img=row[5],
        )
