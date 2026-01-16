import uuid

import psycopg2
from app.db.connection import get_connection
from app.models.user import User


class UserRepository:
    def create_user(self, user: User) -> None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO users (id, name, email, password)
            VALUES (%s, %s, %s, %s)
        """

        try:
            cursor.execute(
                query,
                (
                    str(user.id),
                    user.name,
                    user.email,
                    user.password,
                ),
            )
            conn.commit()
        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def get_user_by_id(self, id: uuid.UUID) -> User | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT id, name, email, password, role
            FROM users
            WHERE id = %s
        """

        try:
            cursor.execute(query, (str(id),))
            row = cursor.fetchone()

            if not row:
                return None

            return User(
                id=uuid.UUID(row[0]),
                name=row[1],
                email=row[2],
                password=row[3],
                role=row[4],
            )
        finally:
            cursor.close()
            conn.close()

    def get_user_by_email(self, email: str) -> User | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            SELECT id, name, email, password, role
            FROM users
            WHERE email = %s
        """

        try:
            cursor.execute(query, (email,))
            row = cursor.fetchone()

            if not row:
                return None

            return User(
                id=uuid.UUID(row[0]),
                name=row[1],
                email=row[2],
                password=row[3],
                role=row[4],
            )
        finally:
            cursor.close()
            conn.close()

    def update_user_name(self, id: uuid.UUID, name: str) -> User | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            UPDATE users
            SET name = %s
            WHERE id = %s
            RETURNING id, name, email, password, role
        """

        try:
            cursor.execute(query, (name, str(id)))
            row = cursor.fetchone()
            conn.commit()

            if not row:
                return None

            return User(
                id=uuid.UUID(row[0]),
                name=row[1],
                email=row[2],
                password=row[3],
                role=row[4],
            )
        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def update_user_email(self, id: uuid.UUID, email: str) -> User | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            UPDATE users
            SET email = %s
            WHERE id = %s
            RETURNING id, name, email, password, role
        """

        try:
            cursor.execute(query, (email, str(id)))
            row = cursor.fetchone()
            conn.commit()

            if not row:
                return None

            return User(
                id=uuid.UUID(row[0]),
                name=row[1],
                email=row[2],
                password=row[3],
                role=row[4],
            )
        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def update_user_password(self, id: uuid.UUID, password: str) -> User | None:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            UPDATE users
            SET password = %s
            WHERE id = %s
            RETURNING id, name, email, password, role
        """

        try:
            cursor.execute(query, (password, str(id)))
            row = cursor.fetchone()
            conn.commit()

            if not row:
                return None

            return User(
                id=uuid.UUID(row[0]),
                name=row[1],
                email=row[2],
                password=row[3],
                role=row[4],
            )
        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()

    def delete_user(self, id: uuid.UUID) -> bool:
        conn = get_connection()
        cursor = conn.cursor()

        query = """
            DELETE FROM users
            WHERE id = %s
        """

        try:
            cursor.execute(query, (id,))
            conn.commit()

            return cursor.rowcount > 0
        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            conn.close()
