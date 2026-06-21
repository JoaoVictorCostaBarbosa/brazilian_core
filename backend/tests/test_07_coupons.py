"""Testes de cupons: CRUD admin e acesso de usuário comum."""
import uuid
import requests
import pytest

BASE_URL = "http://localhost:8000"


@pytest.fixture
def temp_coupon(admin_headers):
    code = f"TMP{uuid.uuid4().hex[:4].upper()}"
    r = requests.post(
        f"{BASE_URL}/api/coupon/",
        json={
            "code": code,
            "discount_percentage": 15,
            "expires_at": "2099-01-01",
        },
        headers=admin_headers,
    )
    assert r.status_code == 201
    coupon = r.json()
    yield coupon
    requests.delete(f"{BASE_URL}/api/coupon/{coupon['id']}", headers=admin_headers)


def test_create_coupon_admin(admin_headers):
    code = f"CREATE{uuid.uuid4().hex[:4].upper()}"
    r = requests.post(
        f"{BASE_URL}/api/coupon/",
        json={
            "code": code,
            "discount_percentage": 25,
            "expires_at": "2099-12-31",
        },
        headers=admin_headers,
    )
    assert r.status_code == 201
    coupon = r.json()
    assert coupon["code"] == code
    requests.delete(f"{BASE_URL}/api/coupon/{coupon['id']}", headers=admin_headers)


def test_create_coupon_forbidden_for_user(user_headers):
    r = requests.post(
        f"{BASE_URL}/api/coupon/",
        json={
            "code": "USERTEST",
            "discount_percentage": 10,
            "expires_at": "2099-01-01",
        },
        headers=user_headers,
    )
    assert r.status_code == 403


def test_create_coupon_invalid_discount(admin_headers):
    r = requests.post(
        f"{BASE_URL}/api/coupon/",
        json={
            "code": "INVALID",
            "discount_percentage": 0,
            "expires_at": "2099-01-01",
        },
        headers=admin_headers,
    )
    assert r.status_code == 422


def test_create_duplicate_coupon_code(admin_headers, sample_coupon):
    r = requests.post(
        f"{BASE_URL}/api/coupon/",
        json={
            "code": sample_coupon["code"],
            "discount_percentage": 5,
            "expires_at": "2099-01-01",
        },
        headers=admin_headers,
    )
    assert r.status_code == 409


def test_get_coupon_by_code(user_headers, sample_coupon):
    r = requests.get(
        f"{BASE_URL}/api/coupon/{sample_coupon['code']}",
        headers=user_headers,
    )
    assert r.status_code == 200
    assert r.json()["code"] == sample_coupon["code"]


def test_get_coupon_not_found(user_headers):
    r = requests.get(f"{BASE_URL}/api/coupon/NOTEXISTS999", headers=user_headers)
    assert r.status_code == 404


def test_list_coupons(user_headers, sample_coupon):
    r = requests.get(f"{BASE_URL}/api/coupon/", headers=user_headers)
    assert r.status_code == 200
    codes = [c["code"] for c in r.json()]
    assert sample_coupon["code"] in codes


def test_update_coupon_discount(admin_headers, temp_coupon):
    r = requests.patch(
        f"{BASE_URL}/api/coupon/",
        json={"id": temp_coupon["id"], "discount_percentage": 50},
        headers=admin_headers,
    )
    assert r.status_code == 200
    assert r.json()["discount_percentage"] == 50


def test_delete_coupon_admin(admin_headers):
    code = f"DEL{uuid.uuid4().hex[:4].upper()}"
    create_r = requests.post(
        f"{BASE_URL}/api/coupon/",
        json={
            "code": code,
            "discount_percentage": 5,
            "expires_at": "2099-01-01",
        },
        headers=admin_headers,
    )
    coupon_id = create_r.json()["id"]
    r = requests.delete(f"{BASE_URL}/api/coupon/{coupon_id}", headers=admin_headers)
    assert r.status_code == 204


def test_delete_coupon_forbidden_for_user(user_headers, sample_coupon):
    r = requests.delete(
        f"{BASE_URL}/api/coupon/{sample_coupon['id']}",
        headers=user_headers,
    )
    assert r.status_code == 403
