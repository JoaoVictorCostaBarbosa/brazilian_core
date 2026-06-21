"""Testes do carrinho: adicionar, listar e remover itens."""
import uuid
import requests
import pytest

BASE_URL = "http://localhost:8000"


def test_add_product_to_cart(user_headers, sample_product):
    r = requests.post(
        f"{BASE_URL}/api/cart/{sample_product['id']}",
        headers=user_headers,
    )
    assert r.status_code == 201


def test_get_cart_contains_product(user_headers, sample_product):
    requests.post(f"{BASE_URL}/api/cart/{sample_product['id']}", headers=user_headers)
    r = requests.get(f"{BASE_URL}/api/cart/", headers=user_headers)
    assert r.status_code == 200
    # ItemInCartResponse usa 'id' como product_id (vem do JOIN products)
    ids = [str(item["id"]) for item in r.json()]
    assert sample_product["id"] in ids


def test_add_same_product_increments_quantity(user_headers, sample_product):
    requests.post(f"{BASE_URL}/api/cart/{sample_product['id']}", headers=user_headers)
    requests.post(f"{BASE_URL}/api/cart/{sample_product['id']}", headers=user_headers)
    r = requests.get(f"{BASE_URL}/api/cart/", headers=user_headers)
    cart = r.json()
    item = next((i for i in cart if str(i["id"]) == sample_product["id"]), None)
    assert item is not None
    assert item["quantity"] >= 2


def test_add_nonexistent_product_to_cart(user_headers):
    r = requests.post(
        f"{BASE_URL}/api/cart/{uuid.uuid4()}",
        headers=user_headers,
    )
    assert r.status_code == 404


def test_remove_product_from_cart(user_headers, sample_product):
    requests.post(f"{BASE_URL}/api/cart/{sample_product['id']}", headers=user_headers)
    r = requests.delete(
        f"{BASE_URL}/api/cart/{sample_product['id']}",
        headers=user_headers,
    )
    assert r.status_code == 200


def test_remove_nonexistent_cart_item(user_headers):
    r = requests.delete(
        f"{BASE_URL}/api/cart/{uuid.uuid4()}",
        headers=user_headers,
    )
    assert r.status_code == 404


def test_cart_requires_auth():
    r = requests.get(f"{BASE_URL}/api/cart/")
    assert r.status_code == 401
