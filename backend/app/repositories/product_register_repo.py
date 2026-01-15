import uuid

import psycopg2
from app.db.connection import get_connection


class ProductRegisterRepository:
    def create_product_register(
        self, product_id: uuid.UUID, order_id: uuid.UUID
    ) -> uuid.UUID | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO product_register
            (id, order_id, product_id, name, price, description, url_img)
            SELECT
                gen_random_uuid(),
                %s,
                %s,
                p.name,
                p.price,
                p.description,
                p.url_img
            FROM products p
            WHERE p.id = %s
            RETURNING id
        """

        try:
            cursor.execute(
                query,
                (
                    str(order_id),
                    str(product_id),
                    str(product_id),
                ),
            )
            row = cursor.fetchone()
            conn.commit()

            if not row:
                return None

            return uuid.UUID(row[0])

        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()
