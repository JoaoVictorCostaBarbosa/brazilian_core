import uuid

import psycopg2
from app.db.connection import get_connection
from app.models.coupon import Coupon


class CouponRepository:
    def create_coupon(self, coupon: Coupon):
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO coupons
            (id, code, discount_percentage, expires_at)
            VALUES (%s, %s, %s, %s)
        """

        try:
            cursor.execute(
                query,
                (
                    str(coupon.id),
                    coupon.code,
                    coupon.discount_percentage,
                    coupon.expires_at,
                ),
            )
            conn.commit()

        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def get_coupon_by_code(self, code: str) -> Coupon | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
              id,
              code,
              discount_percentage,
              expires_at
            FROM coupons
            WHERE code = %s
        """

        try:
            cursor.execute(
                query,
                (code,),
            )
            row = cursor.fetchone()

            if not row:
                return None

            return Coupon(
                id=uuid.UUID(row[0]),
                code=row[1],
                discout_percentage=row[2],
                expires_at=row[3],
            )
        finally:
            cursor.close()
            conn.close()

    def get_coupon_by_id(self, id: str) -> Coupon | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
                id,
                code,
                discount_percentage,
                expires_at
            FROM coupons
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

            return Coupon(
                id=uuid.UUID(row[0]),
                code=row[1],
                discout_percentage=row[2],
                expires_at=row[3],
            )
        finally:
            cursor.close()
            conn.close()

    def get_all_coupons(self) -> list[Coupon]:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
                id,
                code,
                discount_percentage,
                expires_at
            FROM coupons
        """

        try:
            cursor.execute(
                query,
            )
            rows = cursor.fetchall()

            return [
                Coupon(
                    id=uuid.UUID(row[0]),
                    code=row[1],
                    discout_percentage=row[2],
                    expires_at=row[3],
                )
                for row in rows
            ]
        finally:
            cursor.close()
            conn.close()

    def update_coupon_discount(self, discount: int, id: uuid.UUID) -> Coupon | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            UPDATE coupons
            SET discount_percentage = %s
            WHERE id = %s
            RETURNING id, code, discount_percentage, expires_at
        """

        try:
            cursor.execute(
                query,
                (
                    discount,
                    str(id),
                ),
            )
            row = cursor.fetchone()
            conn.commit()

            if not row:
                return None
                        
            return Coupon(
                id=uuid.UUID(row[0]),
                code=row[1],
                discout_percentage=row[2],
                expires_at=row[3],
            )
        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def delete_coupon(self, id: uuid.UUID) -> bool:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            DELETE FROM coupons
            WHERE id = %s
        """

        try:
            cursor.execute(
                query,
                (str(id),),
            )
            conn.commit()

            return cursor.rowcount > 0
        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()
