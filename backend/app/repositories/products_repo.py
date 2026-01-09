import uuid
from decimal import Decimal
from typing import Tuple

from app.db.connection import get_connection
from app.models.products import Product


class ProductRepository:
    def read_products(self) -> list[Product]:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
              id,
              name,
              price,
              description,
              stock_quantity
            FROM products
        """

        try:
            cursor.execute(query)
            rows = cursor.fetchall()

            return [self._row_to_product(row) for row in rows]
        finally:
            cursor.close()
            conn.close()

    def get_product_by_id(self, product_id: uuid.UUID) -> Product | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
              id,
              name,
              price,
              description,
              stock_quantity
            FROM products
            WHERE id = %s
        """

        try:
            cursor.execute(query, (str(product_id),))
            row = cursor.fetchone()

            if not row:
                return None

            return self._row_to_product(row)
        finally:
            cursor.close()
            conn.close()

    def get_product_by_price(self, price: Decimal) -> list[Product]:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
              id,
              name,
              price,
              description,
              stock_quantity
            FROM products
            WHERE price <= %s
        """

        try:
            cursor.execute(query, (price,))
            rows = cursor.fetchall()

            return [self._row_to_product(row) for row in rows]
        finally:
            cursor.close()
            conn.close()

    def _row_to_product(self, row: Tuple[str, str, Decimal, str, int]) -> Product:
        return Product(
            id=uuid.UUID(row[0]),
            name=row[1],
            price=row[2],
            description=row[3],
            stock_quantity=row[4],
        )
