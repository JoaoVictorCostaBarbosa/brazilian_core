"""Testes de produtos: listagem, busca, filtro combinado e CRUD admin."""
import uuid
import requests
import pytest

BASE_URL = "http://localhost:8000"


# --------------------------------------------------------------------------- #
# Listagem e leitura                                                           #
# --------------------------------------------------------------------------- #

def test_list_products_returns_list(user_headers):
    r = requests.get(f"{BASE_URL}/api/products/0/5", headers=user_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_get_product_by_id(user_headers, sample_product):
    r = requests.get(f"{BASE_URL}/api/products/{sample_product['id']}", headers=user_headers)
    assert r.status_code == 200
    assert r.json()["id"] == sample_product["id"]


def test_get_product_not_found(user_headers):
    fake_id = str(uuid.uuid4())
    r = requests.get(f"{BASE_URL}/api/products/{fake_id}", headers=user_headers)
    assert r.status_code == 404


def test_get_product_by_price(user_headers):
    r = requests.get(f"{BASE_URL}/api/products/price/500", headers=user_headers)
    assert r.status_code == 200
    products = r.json()
    assert all(float(p["price"]) <= 500 for p in products)


def test_search_by_name(user_headers, sample_product):
    name_fragment = sample_product["name"][:8]
    r = requests.get(
        f"{BASE_URL}/api/products/search?name={name_fragment}",
        headers=user_headers,
    )
    assert r.status_code == 200
    ids = [p["id"] for p in r.json()]
    assert sample_product["id"] in ids


def test_search_no_results(user_headers):
    r = requests.get(
        f"{BASE_URL}/api/products/search?name=xyzabcnotexist123",
        headers=user_headers,
    )
    assert r.status_code == 200
    assert r.json() == []


# --------------------------------------------------------------------------- #
# Filtro Combinado (nova funcionalidade)                                       #
# --------------------------------------------------------------------------- #

def test_filter_by_name(user_headers, sample_product):
    name_fragment = sample_product["name"][:8]
    r = requests.get(
        f"{BASE_URL}/api/products/filter?name={name_fragment}",
        headers=user_headers,
    )
    assert r.status_code == 200
    ids = [p["id"] for p in r.json()]
    assert sample_product["id"] in ids


def test_filter_by_max_price(user_headers):
    r = requests.get(
        f"{BASE_URL}/api/products/filter?max_price=300",
        headers=user_headers,
    )
    assert r.status_code == 200
    products = r.json()
    assert all(float(p["price"]) <= 300 for p in products)


def test_filter_in_stock_only(user_headers):
    r = requests.get(
        f"{BASE_URL}/api/products/filter?in_stock=true",
        headers=user_headers,
    )
    assert r.status_code == 200
    products = r.json()
    assert all(p["stock_quantity"] > 0 for p in products)


def test_filter_combined_name_and_price(user_headers, sample_product):
    r = requests.get(
        f"{BASE_URL}/api/products/filter?name=Pytest&max_price=500&in_stock=true",
        headers=user_headers,
    )
    assert r.status_code == 200
    products = r.json()
    assert all(float(p["price"]) <= 500 for p in products)
    assert all(p["stock_quantity"] > 0 for p in products)


def test_filter_min_rating_no_results(user_headers):
    r = requests.get(
        f"{BASE_URL}/api/products/filter?name=xyznotexist&min_rating=5",
        headers=user_headers,
    )
    assert r.status_code == 200
    assert r.json() == []


def test_filter_empty_params_returns_all(user_headers):
    all_r = requests.get(f"{BASE_URL}/api/products/0/9999", headers=user_headers)
    filter_r = requests.get(f"{BASE_URL}/api/products/filter", headers=user_headers)
    assert filter_r.status_code == 200
    # O filtro sem parâmetros deve retornar o mesmo conjunto (ordem pode diferir)
    assert len(filter_r.json()) == len(all_r.json())


# --------------------------------------------------------------------------- #
# CRUD admin                                                                   #
# --------------------------------------------------------------------------- #

def test_create_product_admin(admin_headers):
    payload = {
        "name": f"Admin Product {uuid.uuid4().hex[:6]}",
        "price": 99.99,
        "description": "Criado pelo teste de admin",
        "stock_quantity": 5,
        "url_img": "https://example.com/img.jpg",
    }
    r = requests.post(f"{BASE_URL}/api/products/", json=payload, headers=admin_headers)
    assert r.status_code == 201
    product = r.json()
    assert product["name"] == payload["name"]
    # Cleanup
    requests.delete(f"{BASE_URL}/api/products/{product['id']}", headers=admin_headers)


def test_create_product_forbidden_for_user(user_headers):
    payload = {
        "name": "Should Fail",
        "price": 10.0,
        "description": "x",
        "stock_quantity": 1,
        "url_img": "https://example.com/img.jpg",
    }
    r = requests.post(f"{BASE_URL}/api/products/", json=payload, headers=user_headers)
    assert r.status_code == 403


def test_update_product_admin(admin_headers, sample_product):
    update = {
        "name": sample_product["name"],
        "price": 299.90,
        "description": "Descrição atualizada",
        "stock_quantity": 20,
        "url_img": sample_product["url_img"],
    }
    r = requests.patch(
        f"{BASE_URL}/api/products/{sample_product['id']}",
        json=update,
        headers=admin_headers,
    )
    assert r.status_code == 200
    assert r.json()["stock_quantity"] == 20


def test_update_product_forbidden_for_user(user_headers, sample_product):
    r = requests.patch(
        f"{BASE_URL}/api/products/{sample_product['id']}",
        json={
            "name": "X", "price": 1.0, "description": "y",
            "stock_quantity": 1, "url_img": "https://x.com/i.jpg"
        },
        headers=user_headers,
    )
    assert r.status_code == 403


def test_delete_product_forbidden_for_user(user_headers, sample_product):
    r = requests.delete(
        f"{BASE_URL}/api/products/{sample_product['id']}",
        headers=user_headers,
    )
    assert r.status_code == 403


def test_delete_nonexistent_product(admin_headers):
    r = requests.delete(
        f"{BASE_URL}/api/products/{uuid.uuid4()}",
        headers=admin_headers,
    )
    assert r.status_code == 404
