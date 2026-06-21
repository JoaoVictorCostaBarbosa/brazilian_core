import uuid

from app.models.coupon import Coupon
from app.repositories.base import BaseRepository


class CouponRepository(BaseRepository):
    def create_coupon(self, coupon: Coupon) -> None:
        query = """
            INSERT INTO coupons (id, code, discount_percentage, expires_at)
            VALUES (%s, %s, %s, %s)
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(
                query,
                (str(coupon.id), coupon.code, coupon.discount_percentage, coupon.expires_at),
            )

    def get_coupon_by_code(self, code: str) -> Coupon | None:
        query = """
            SELECT id, code, discount_percentage, expires_at
            FROM coupons
            WHERE code = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (code,))
            row = cursor.fetchone()

        if not row:
            return None

        return self._row_to_coupon(row)

    def get_coupon_by_id(self, id: str) -> Coupon | None:
        query = """
            SELECT id, code, discount_percentage, expires_at
            FROM coupons
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(id),))
            row = cursor.fetchone()

        if not row:
            return None

        return self._row_to_coupon(row)

    def get_all_coupons(self) -> list[Coupon]:
        query = """
            SELECT id, code, discount_percentage, expires_at
            FROM coupons
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query)
            rows = cursor.fetchall()

        return [self._row_to_coupon(row) for row in rows]

    def update_coupon_discount(self, discount: int, id: uuid.UUID) -> Coupon | None:
        query = """
            UPDATE coupons
            SET discount_percentage = %s
            WHERE id = %s
            RETURNING id, code, discount_percentage, expires_at
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (discount, str(id)))
            row = cursor.fetchone()

        if not row:
            return None

        return self._row_to_coupon(row)

    def delete_coupon(self, id: uuid.UUID) -> bool:
        query = """
            DELETE FROM coupons
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(id),))
            return cursor.rowcount > 0

    def _row_to_coupon(self, row) -> Coupon:
        return Coupon(
            id=uuid.UUID(row[0]),
            code=row[1],
            discout_percentage=row[2],
            expires_at=row[3],
        )
