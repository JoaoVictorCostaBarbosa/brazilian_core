from datetime import date

from app.repositories.base import BaseRepository


class StatsRepository(BaseRepository):
    def get_overview(self) -> dict:
        query = """
            SELECT
                (SELECT COUNT(*) FROM orders) AS total_orders,
                (SELECT COALESCE(SUM(total_value), 0) FROM vw_order_summary) AS total_revenue,
                (SELECT COALESCE(AVG(total_value), 0) FROM vw_order_summary) AS avg_ticket,
                (SELECT COUNT(*) FROM users WHERE role = 'user') AS total_users,
                (SELECT COUNT(*) FROM products WHERE stock_quantity = 0) AS out_of_stock,
                (SELECT COUNT(*) FROM products WHERE stock_quantity > 0 AND stock_quantity <= 5) AS low_stock
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query)
            row = cursor.fetchone()

        return {
            "total_orders": int(row[0]),
            "total_revenue": float(row[1]),
            "avg_ticket": float(row[2]),
            "total_users": int(row[3]),
            "out_of_stock": int(row[4]),
            "low_stock": int(row[5]),
        }

    def get_top_products(self, limit: int) -> list[dict]:
        query = """
            SELECT
                product_id,
                product_name,
                product_url_img,
                SUM(product_quantity) AS total_sold,
                SUM(product_price * product_quantity) AS total_revenue
            FROM vw_order_details
            GROUP BY product_id, product_name, product_url_img
            ORDER BY total_sold DESC
            LIMIT %s
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (limit,))
            rows = cursor.fetchall()

        return [
            {
                "product_id": str(row[0]),
                "product_name": row[1],
                "product_url_img": row[2],
                "total_sold": int(row[3]),
                "total_revenue": float(row[4]),
            }
            for row in rows
        ]

    def get_revenue_by_period(self, start: date, end: date) -> list[dict]:
        query = """
            SELECT
                order_purchase_at AS day,
                SUM(total_value) AS revenue,
                COUNT(DISTINCT order_id) AS orders_count
            FROM vw_order_summary
            WHERE order_purchase_at >= %s AND order_purchase_at <= %s
            GROUP BY order_purchase_at
            ORDER BY day
        """
        with self._get_cursor() as (conn, cursor):
            cursor.execute(query, (start, end))
            rows = cursor.fetchall()

        return [
            {
                "day": row[0].isoformat(),
                "revenue": float(row[1]),
                "orders_count": int(row[2]),
            }
            for row in rows
        ]
