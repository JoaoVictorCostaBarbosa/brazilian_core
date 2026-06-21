"""Testes de pedidos: criar, listar e obter detalhes."""
import requests
import pytest

BASE_URL = "http://localhost:8000"


@pytest.fixture
def order_with_product(user_headers, sample_product):
    """Adiciona produto ao carrinho e finaliza compra. Retorna o pedido."""
    # Garante que o produto está no carrinho
    requests.post(
        f"{BASE_URL}/api/cart/{sample_product['id']}",
        headers=user_headers,
    )
    r = requests.post(f"{BASE_URL}/api/order/", headers=user_headers)
    assert r.status_code == 201, f"Criação de pedido falhou: {r.text}"
    return r.json()


def test_create_order_from_cart(order_with_product):
    order = order_with_product
    assert "order_id" in order
    assert "purchase_value" in order
    assert len(order["products_register"]) > 0


def test_create_order_with_coupon(user_headers, sample_product, sample_coupon):
    requests.post(f"{BASE_URL}/api/cart/{sample_product['id']}", headers=user_headers)
    r = requests.post(
        f"{BASE_URL}/api/order/?coupon_code={sample_coupon['code']}",
        headers=user_headers,
    )
    assert r.status_code == 201
    assert r.json()["coupon_id"] is not None


def test_create_order_with_expired_coupon(admin_headers, user_headers, sample_product):
    import uuid
    code = f"EXP{uuid.uuid4().hex[:4].upper()}"
    create_r = requests.post(
        f"{BASE_URL}/api/coupon/",
        json={
            "code": code,
            "discount_percentage": 20,
            "expires_at": "2000-01-01",
        },
        headers=admin_headers,
    )
    assert create_r.status_code == 201
    coupon_id = create_r.json()["id"]

    requests.post(f"{BASE_URL}/api/cart/{sample_product['id']}", headers=user_headers)
    r = requests.post(
        f"{BASE_URL}/api/order/?coupon_code={code}",
        headers=user_headers,
    )
    assert r.status_code == 422

    requests.delete(f"{BASE_URL}/api/coupon/{coupon_id}", headers=admin_headers)


def test_list_orders(user_headers, order_with_product):
    r = requests.get(f"{BASE_URL}/api/order/", headers=user_headers)
    assert r.status_code == 200
    orders = r.json()
    assert isinstance(orders, list)
    ids = [o["order_id"] for o in orders]
    assert order_with_product["order_id"] in ids


def test_get_order_detail(user_headers, order_with_product):
    order_id = order_with_product["order_id"]
    r = requests.get(f"{BASE_URL}/api/order/{order_id}", headers=user_headers)
    assert r.status_code == 200
    data = r.json()
    assert data["order_id"] == order_id
    assert "products_register" in data
    assert len(data["products_register"]) > 0


def test_order_detail_forbidden_for_other_user(admin_headers, order_with_product):
    """Admin tentando acessar pedido de outro usuário deve receber 403."""
    order_id = order_with_product["order_id"]
    r = requests.get(f"{BASE_URL}/api/order/{order_id}", headers=admin_headers)
    assert r.status_code == 403


def test_order_summary_fields(user_headers, order_with_product):
    r = requests.get(f"{BASE_URL}/api/order/", headers=user_headers)
    order = next(
        o for o in r.json() if o["order_id"] == order_with_product["order_id"]
    )
    assert "total_products" in order
    assert "total_items" in order
    assert "total_value" in order
    assert order["total_products"] >= 1
