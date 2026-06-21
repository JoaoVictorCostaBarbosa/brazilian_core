import uuid

from app.repositories.base import BaseRepository


class ProductRegisterRepository(BaseRepository):
    def create_product_register(
        self, product_id: uuid.UUID, order_id: uuid.UUID
    ) -> uuid.UUID | None:
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
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(order_id), str(product_id), str(product_id)))
            row = cursor.fetchone()

        if not row:
            return None

        return uuid.UUID(row[0])
