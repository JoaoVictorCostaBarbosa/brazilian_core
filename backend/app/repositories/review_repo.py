import uuid

import psycopg2
from app.db.connection import get_connection
from app.models.review import Review


class ReviewRepository:
    def create_review(self, review: Review):
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO review
              (
                id,
                user_id,
                product_id,
                rating,
                comment,
                created_at
              )
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        try:
            cursor.execute(
                query,
                (
                    str(review.id),
                    str(review.user_id),
                    str(review.product_id),
                    review.rating,
                    review.comment,
                    review.created_at,
                ),
            )
            conn.commit()

        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def get_product_reviews(self, product_id: uuid.UUID) -> list[Review]:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
              id,
              user_id,
              product_id,
              rating,
              comment,
              created_at
            FROM review
            WHERE product_id = %s
        """

        try:
            cursor.execute(query, (str(product_id),))
            rows = cursor.fetchall()

            return [
                Review(
                    id=uuid.UUID(row[0]),
                    user_id=uuid.UUID(row[1]),
                    product_id=uuid.UUID(row[2]),
                    rating=row[3],
                    comment=row[4],
                    created_at=row[5],
                )
                for row in rows
            ]

        finally:
            cursor.close()
            conn.close()

    def get_user_reviews(self, user_id: uuid.UUID) -> list[Review]:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
              id,
              user_id,
              product_id,
              rating,
              comment,
              created_at
            FROM review
            WHERE user_id = %s
        """

        try:
            cursor.execute(query, (str(user_id),))
            rows = cursor.fetchall()

            return [
                Review(
                    id=uuid.UUID(row[0]),
                    user_id=uuid.UUID(row[1]),
                    product_id=uuid.UUID(row[2]),
                    rating=row[3],
                    comment=row[4],
                    created_at=row[5],
                )
                for row in rows
            ]

        finally:
            cursor.close()
            conn.close()

    def get_review_by_id(self, id: uuid.UUID) -> Review | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
              id,
              user_id,
              product_id,
              rating,
              comment,
              created_at
            FROM review
            WHERE id = %s
        """

        try:
            cursor.execute(query, (str(id),))
            row = cursor.fetchone()

            if not row:
                return None

            return Review(
                id=uuid.UUID(row[0]),
                user_id=uuid.UUID(row[1]),
                product_id=uuid.UUID(row[2]),
                rating=row[3],
                comment=row[4],
                created_at=row[5],
            )

        finally:
            cursor.close()
            conn.close()

    def get_existing_review(
        self, user_id: uuid.UUID, product_id: uuid.UUID
    ) -> Review | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT
              id,
              user_id,
              product_id,
              rating,
              comment,
              created_at
            FROM review
            WHERE user_id = %s 
              AND product_id = %s
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

            return Review(
                id=uuid.UUID(row[0]),
                user_id=uuid.UUID(row[1]),
                product_id=uuid.UUID(row[2]),
                rating=row[3],
                comment=row[4],
                created_at=row[5],
            )

        finally:
            cursor.close()
            conn.close()

    def update_review_comment(self, comment: str, id: uuid.UUID):
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            UPDATE review
            SET comment = %s
            WHERE id = %s
        """

        try:
            cursor.execute(
                query,
                (
                    comment,
                    str(id),
                ),
            )
            conn.commit()

        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def update_review_rating(self, rating: int, id: uuid.UUID):
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            UPDATE review
            SET rating = %s
            WHERE id = %s
        """

        try:
            cursor.execute(
                query,
                (
                    rating,
                    str(id),
                ),
            )
            conn.commit()

        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def detele_review(self, id: uuid.UUID):
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            DELETE FROM review
            WHERE id = %s
        """

        try:
            cursor.execute(
                query,
                (str(id),),
            )
            conn.commit()

        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()
