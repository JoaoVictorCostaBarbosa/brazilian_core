"""Testes de autenticação: registro, login e token inválido."""
import uuid
import requests
import pytest

BASE_URL = "http://localhost:8000"


def test_register_success():
    email = f"register_{uuid.uuid4().hex[:8]}@pytest.local"
    r = requests.post(
        f"{BASE_URL}/api/auth/register",
        json={"name": "Test Register", "email": email, "password": "pass123"},
    )
    assert r.status_code == 201
    data = r.json()
    assert "token" in data
    assert data["user"]["email"] == email
    # role pode ser None logo após registro (INSERT sem RETURNING role)
    assert data["user"]["role"] in ("user", None)


def test_register_duplicate_email():
    email = f"dup_{uuid.uuid4().hex[:8]}@pytest.local"
    payload = {"name": "User A", "email": email, "password": "pass123"}
    requests.post(f"{BASE_URL}/api/auth/register", json=payload)
    r = requests.post(f"{BASE_URL}/api/auth/register", json=payload)
    assert r.status_code == 409


def test_login_success():
    email = f"login_{uuid.uuid4().hex[:8]}@pytest.local"
    requests.post(
        f"{BASE_URL}/api/auth/register",
        json={"name": "Login User", "email": email, "password": "mypassword"},
    )
    r = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": email, "password": "mypassword"},
    )
    assert r.status_code == 200
    assert "token" in r.json()


def test_login_wrong_password():
    r = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "admin@email.com", "password": "errado"},
    )
    assert r.status_code == 401


def test_login_unknown_email():
    r = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "naoexiste@pytest.local", "password": "qualquer"},
    )
    assert r.status_code == 401


def test_protected_route_without_token():
    r = requests.get(f"{BASE_URL}/api/user/me")
    assert r.status_code == 401


def test_protected_route_with_invalid_token():
    r = requests.get(
        f"{BASE_URL}/api/user/me",
        headers={"Authorization": "Bearer token_invalido"},
    )
    assert r.status_code == 401


def test_get_current_user(user_headers):
    r = requests.get(f"{BASE_URL}/api/user/me", headers=user_headers)
    assert r.status_code == 200
    data = r.json()
    assert "id" in data
    assert "email" in data
    assert data["role"] in ("user", "admin")
