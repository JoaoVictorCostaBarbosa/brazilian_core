import uuid

from app.models.review import Review
from app.repositories.base import BaseRepository


class ReviewRepository(BaseRepository):
    def create_review(self, review: Review) -> None:
        query = """
            INSERT INTO review (id, user_id, product_id, rating, comment, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        with self._get_cursor() as (conn, cursor):
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

    def get_product_reviews(self, product_id: uuid.UUID) -> list[Review]:
        query = """
            SELECT id, user_id, product_id, rating, comment, created_at
            FROM review
            WHERE product_id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(product_id),))
            rows = cursor.fetchall()

        return [self._row_to_review(row) for row in rows]

    def get_user_reviews(self, user_id: uuid.UUID) -> list[Review]:
        query = """
            SELECT id, user_id, product_id, rating, comment, created_at
            FROM review
            WHERE user_id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(user_id),))
            rows = cursor.fetchall()

        return [self._row_to_review(row) for row in rows]

    def get_review_by_id(self, id: uuid.UUID) -> Review | None:
        query = """
            SELECT id, user_id, product_id, rating, comment, created_at
            FROM review
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(id),))
            row = cursor.fetchone()

        if not row:
            return None

        return self._row_to_review(row)

    def get_existing_review(
        self, user_id: uuid.UUID, product_id: uuid.UUID
    ) -> Review | None:
        query = """
            SELECT id, user_id, product_id, rating, comment, created_at
            FROM review
            WHERE user_id = %s AND product_id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(user_id), str(product_id)))
            row = cursor.fetchone()

        if not row:
            return None

        return self._row_to_review(row)

    def update_review_comment(self, comment: str, id: uuid.UUID) -> None:
        query = """
            UPDATE review
            SET comment = %s
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (comment, str(id)))

    def update_review_rating(self, rating: int, id: uuid.UUID) -> None:
        query = """
            UPDATE review
            SET rating = %s
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (rating, str(id)))

    def detele_review(self, id: uuid.UUID) -> None:
        query = """
            DELETE FROM review
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(id),))

    def _row_to_review(self, row) -> Review:
        return Review(
            id=uuid.UUID(row[0]),
            user_id=uuid.UUID(row[1]),
            product_id=uuid.UUID(row[2]),
            rating=row[3],
            comment=row[4],
            created_at=row[5],
        )
