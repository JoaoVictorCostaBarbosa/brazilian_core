import uuid
from decimal import Decimal
from typing import Tuple

from app.models.products import Product
from app.repositories.base import BaseRepository


class ProductRepository(BaseRepository):
    def create_product(self, product: Product) -> None:
        query = """
            INSERT INTO products (id, name, price, description, stock_quantity, url_img)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(
                query,
                (str(product.id), product.name, product.price, product.description, product.stock_quantity, product.url_img),
            )

    def update_product(self, product_id: uuid.UUID, name: str, price: Decimal, description: str, stock_quantity: int, url_img: str) -> Product | None:
        query = """
            UPDATE products
            SET name = %s, price = %s, description = %s, stock_quantity = %s, url_img = %s
            WHERE id = %s
            RETURNING id, name, price, description, stock_quantity, url_img
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (name, price, description, stock_quantity, url_img, str(product_id)))
            row = cursor.fetchone()

        if not row:
            return None

        return self._row_to_product(row)

    def delete_product(self, product_id: uuid.UUID) -> bool:
        query = """
            DELETE FROM products
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(product_id),))
            return cursor.rowcount > 0

    def search_by_name(self, name: str) -> list[Product]:
        query = """
            SELECT id, name, price, description, stock_quantity, url_img
            FROM products
            WHERE name ILIKE %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (f"%{name}%",))
            rows = cursor.fetchall()

        return [self._row_to_product(row) for row in rows]

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
