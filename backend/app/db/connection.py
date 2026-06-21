import threading

import psycopg2
import psycopg2.pool
from app.config import settings


class DatabasePool:
    """
    Singleton Pattern — garante uma única instância do pool de conexões.
    Thread-safe via double-checked locking.
    """

    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    instance = super().__new__(cls)
                    instance._pool = psycopg2.pool.ThreadedConnectionPool(
                        minconn=1,
                        maxconn=10,
                        host=settings.POSTGRES_HOST,
                        database=settings.POSTGRES_DB,
                        user=settings.POSTGRES_USER,
                        password=settings.POSTGRES_PASSWORD,
                        port=settings.POSTGRES_PORT,
                    )
                    cls._instance = instance
        return cls._instance

    def getconn(self):
        return self._pool.getconn()

    def putconn(self, conn) -> None:
        self._pool.putconn(conn)


def get_connection():
    """Cria uma conexão avulsa (mantida para compatibilidade)."""
    return psycopg2.connect(
        host=settings.POSTGRES_HOST,
        database=settings.POSTGRES_DB,
        user=settings.POSTGRES_USER,
        password=settings.POSTGRES_PASSWORD,
        port=settings.POSTGRES_PORT,
    )
