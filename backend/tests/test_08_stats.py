"""Testes do dashboard analítico (admin stats) — nova funcionalidade."""
import requests
import pytest
from datetime import date, timedelta

BASE_URL = "http://localhost:8000"

TODAY = date.today().isoformat()
THIRTY_DAYS_AGO = (date.today() - timedelta(days=29)).isoformat()


# --------------------------------------------------------------------------- #
# /api/admin/stats/overview                                                    #
# --------------------------------------------------------------------------- #

def test_overview_returns_all_fields(admin_headers):
    r = requests.get(f"{BASE_URL}/api/admin/stats/overview", headers=admin_headers)
    assert r.status_code == 200
    data = r.json()
    expected_keys = {
        "total_orders", "total_revenue", "avg_ticket",
        "total_users", "out_of_stock", "low_stock",
    }
    assert expected_keys.issubset(data.keys())


def test_overview_values_are_non_negative(admin_headers):
    r = requests.get(f"{BASE_URL}/api/admin/stats/overview", headers=admin_headers)
    data = r.json()
    assert data["total_orders"] >= 0
    assert float(data["total_revenue"]) >= 0
    assert float(data["avg_ticket"]) >= 0
    assert data["total_users"] >= 0
    assert data["out_of_stock"] >= 0
    assert data["low_stock"] >= 0


def test_overview_forbidden_for_user(user_headers):
    r = requests.get(f"{BASE_URL}/api/admin/stats/overview", headers=user_headers)
    assert r.status_code == 403


def test_overview_requires_auth():
    r = requests.get(f"{BASE_URL}/api/admin/stats/overview")
    assert r.status_code == 401


# --------------------------------------------------------------------------- #
# /api/admin/stats/top-products                                                #
# --------------------------------------------------------------------------- #

def test_top_products_default_limit(admin_headers):
    r = requests.get(f"{BASE_URL}/api/admin/stats/top-products", headers=admin_headers)
    assert r.status_code == 200
    products = r.json()
    assert isinstance(products, list)
    assert len(products) <= 5


def test_top_products_custom_limit(admin_headers):
    r = requests.get(
        f"{BASE_URL}/api/admin/stats/top-products?limit=3",
        headers=admin_headers,
    )
    assert r.status_code == 200
    assert len(r.json()) <= 3


def test_top_products_fields(admin_headers):
    r = requests.get(f"{BASE_URL}/api/admin/stats/top-products", headers=admin_headers)
    if r.json():
        item = r.json()[0]
        assert "product_id" in item
        assert "product_name" in item
        assert "total_sold" in item
        assert "total_revenue" in item


def test_top_products_sorted_descending(admin_headers):
    r = requests.get(
        f"{BASE_URL}/api/admin/stats/top-products?limit=10",
        headers=admin_headers,
    )
    products = r.json()
    if len(products) >= 2:
        sold_values = [p["total_sold"] for p in products]
        assert sold_values == sorted(sold_values, reverse=True)


def test_top_products_limit_out_of_range(admin_headers):
    r = requests.get(
        f"{BASE_URL}/api/admin/stats/top-products?limit=100",
        headers=admin_headers,
    )
    assert r.status_code == 422


def test_top_products_forbidden_for_user(user_headers):
    r = requests.get(
        f"{BASE_URL}/api/admin/stats/top-products",
        headers=user_headers,
    )
    assert r.status_code == 403


# --------------------------------------------------------------------------- #
# /api/admin/stats/revenue                                                     #
# --------------------------------------------------------------------------- #

def test_revenue_valid_period(admin_headers):
    r = requests.get(
        f"{BASE_URL}/api/admin/stats/revenue?start={THIRTY_DAYS_AGO}&end={TODAY}",
        headers=admin_headers,
    )
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_revenue_item_fields(admin_headers):
    r = requests.get(
        f"{BASE_URL}/api/admin/stats/revenue?start={THIRTY_DAYS_AGO}&end={TODAY}",
        headers=admin_headers,
    )
    items = r.json()
    if items:
        item = items[0]
        assert "day" in item
        assert "revenue" in item
        assert "orders_count" in item
        assert float(item["revenue"]) >= 0
        assert item["orders_count"] >= 0


def test_revenue_end_before_start_returns_error(admin_headers):
    r = requests.get(
        f"{BASE_URL}/api/admin/stats/revenue?start={TODAY}&end={THIRTY_DAYS_AGO}",
        headers=admin_headers,
    )
    assert r.status_code == 422


def test_revenue_forbidden_for_user(user_headers):
    r = requests.get(
        f"{BASE_URL}/api/admin/stats/revenue?start={THIRTY_DAYS_AGO}&end={TODAY}",
        headers=user_headers,
    )
    assert r.status_code == 403


def test_revenue_missing_params(admin_headers):
    r = requests.get(
        f"{BASE_URL}/api/admin/stats/revenue?start={TODAY}",
        headers=admin_headers,
    )
    assert r.status_code == 422
