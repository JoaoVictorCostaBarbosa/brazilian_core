"""Testes da wishlist (lista de desejos) — nova funcionalidade."""
import uuid
import requests
import pytest

BASE_URL = "http://localhost:8000"


@pytest.fixture(autouse=True)
def clean_wishlist(user_headers, sample_product):
    """Remove o produto da wishlist antes e depois de cada teste deste módulo."""
    requests.delete(
        f"{BASE_URL}/api/wishlist/{sample_product['id']}",
        headers=user_headers,
    )
    yield
    requests.delete(
        f"{BASE_URL}/api/wishlist/{sample_product['id']}",
        headers=user_headers,
    )


def test_add_to_wishlist(user_headers, sample_product):
    r = requests.post(
        f"{BASE_URL}/api/wishlist/{sample_product['id']}",
        headers=user_headers,
    )
    assert r.status_code == 201


def test_get_wishlist_contains_product(user_headers, sample_product):
    requests.post(
        f"{BASE_URL}/api/wishlist/{sample_product['id']}",
        headers=user_headers,
    )
    r = requests.get(f"{BASE_URL}/api/wishlist/", headers=user_headers)
    assert r.status_code == 200
    ids = [item["product_id"] for item in r.json()]
    assert sample_product["id"] in ids


def test_wishlist_item_has_product_fields(user_headers, sample_product):
    requests.post(
        f"{BASE_URL}/api/wishlist/{sample_product['id']}",
        headers=user_headers,
    )
    r = requests.get(f"{BASE_URL}/api/wishlist/", headers=user_headers)
    item = next(i for i in r.json() if i["product_id"] == sample_product["id"])
    assert "name" in item
    assert "price" in item
    assert "stock_quantity" in item
    assert "url_img" in item


def test_add_duplicate_to_wishlist_returns_conflict(user_headers, sample_product):
    requests.post(
        f"{BASE_URL}/api/wishlist/{sample_product['id']}",
        headers=user_headers,
    )
    r = requests.post(
        f"{BASE_URL}/api/wishlist/{sample_product['id']}",
        headers=user_headers,
    )
    assert r.status_code == 409


def test_add_nonexistent_product_to_wishlist(user_headers):
    r = requests.post(
        f"{BASE_URL}/api/wishlist/{uuid.uuid4()}",
        headers=user_headers,
    )
    assert r.status_code == 404


def test_remove_from_wishlist(user_headers, sample_product):
    requests.post(
        f"{BASE_URL}/api/wishlist/{sample_product['id']}",
        headers=user_headers,
    )
    r = requests.delete(
        f"{BASE_URL}/api/wishlist/{sample_product['id']}",
        headers=user_headers,
    )
    assert r.status_code == 204

    # Confirma que foi removido
    r2 = requests.get(f"{BASE_URL}/api/wishlist/", headers=user_headers)
    ids = [i["product_id"] for i in r2.json()]
    assert sample_product["id"] not in ids


def test_remove_nonexistent_wishlist_item(user_headers):
    r = requests.delete(
        f"{BASE_URL}/api/wishlist/{uuid.uuid4()}",
        headers=user_headers,
    )
    assert r.status_code == 404


def test_wishlist_requires_auth():
    r = requests.get(f"{BASE_URL}/api/wishlist/")
    assert r.status_code == 401
