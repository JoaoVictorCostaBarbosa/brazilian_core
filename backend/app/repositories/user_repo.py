import uuid

from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository):
    def create_user(self, user: User) -> None:
        query = """
            INSERT INTO users (id, name, email, password)
            VALUES (%s, %s, %s, %s)
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(user.id), user.name, user.email, user.password))

    def get_user_by_id(self, id: uuid.UUID) -> User | None:
        query = """
            SELECT id, name, email, password, role
            FROM users
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
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

    def get_user_by_email(self, email: str) -> User | None:
        query = """
            SELECT id, name, email, password, role
            FROM users
            WHERE email = %s
        """
        with self._get_cursor() as (conn, cursor):
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

    def update_user_name(self, id: uuid.UUID, name: str) -> User | None:
        query = """
            UPDATE users
            SET name = %s
            WHERE id = %s
            RETURNING id, name, email, password, role
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (name, str(id)))
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

    def update_user_email(self, id: uuid.UUID, email: str) -> User | None:
        query = """
            UPDATE users
            SET email = %s
            WHERE id = %s
            RETURNING id, name, email, password, role
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (email, str(id)))
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

    def update_user_password(self, id: uuid.UUID, password: str) -> User | None:
        query = """
            UPDATE users
            SET password = %s
            WHERE id = %s
            RETURNING id, name, email, password, role
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (password, str(id)))
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

    def delete_user(self, id: uuid.UUID) -> bool:
        query = """
            DELETE FROM users
            WHERE id = %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (str(id),))
            return cursor.rowcount > 0

    def list_all_users(self) -> list[User]:
        query = """
            SELECT id, name, email, password, role
            FROM users
            ORDER BY name
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query)
            rows = cursor.fetchall()

        return [
            User(
                id=uuid.UUID(row[0]),
                name=row[1],
                email=row[2],
                password=row[3],
                role=row[4],
            )
            for row in rows
        ]

    def update_user_role(self, id: uuid.UUID, role: str) -> User | None:
        query = """
            UPDATE users
            SET role = %s
            WHERE id = %s
            RETURNING id, name, email, password, role
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (role, str(id)))
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
