from contextlib import contextmanager

import psycopg2
from app.db.connection import DatabasePool


class BaseRepository:
    """
    Template Method Pattern — define o esqueleto do acesso ao banco.

    Subclasses herdam _get_cursor() e não precisam mais gerenciar
    conexão, commit/rollback ou devolução ao pool manualmente.
    O "template" é: obter conexão → executar → commit/rollback → devolver ao pool.
    """

    @contextmanager
    def _get_cursor(self):
        pool = DatabasePool()
        conn = pool.getconn()
        cursor = conn.cursor()
        try:
            yield conn, cursor
            conn.commit()
        except psycopg2.Error:
            conn.rollback()
            raise
        finally:
            cursor.close()
            pool.putconn(conn)
