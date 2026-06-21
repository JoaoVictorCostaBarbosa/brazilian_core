"""Testes de gerenciamento de usuários (admin) — nova funcionalidade."""
import uuid
import requests
import pytest

BASE_URL = "http://localhost:8000"


# --------------------------------------------------------------------------- #
# GET /api/admin/users/                                                        #
# --------------------------------------------------------------------------- #

def test_list_users_returns_list(admin_headers):
    r = requests.get(f"{BASE_URL}/api/admin/users/", headers=admin_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)
    assert len(r.json()) > 0


def test_list_users_fields(admin_headers):
    r = requests.get(f"{BASE_URL}/api/admin/users/", headers=admin_headers)
    user = r.json()[0]
    assert "id" in user
    assert "name" in user
    assert "email" in user
    assert "role" in user
    assert "password" not in user


def test_list_users_contains_valid_roles(admin_headers):
    r = requests.get(f"{BASE_URL}/api/admin/users/", headers=admin_headers)
    roles = {u["role"] for u in r.json()}
    assert roles.issubset({"user", "admin"})


def test_list_users_forbidden_for_user(user_headers):
    r = requests.get(f"{BASE_URL}/api/admin/users/", headers=user_headers)
    assert r.status_code == 403


def test_list_users_requires_auth():
    r = requests.get(f"{BASE_URL}/api/admin/users/")
    assert r.status_code == 401


# --------------------------------------------------------------------------- #
# PATCH /api/admin/users/{id}/role                                             #
# --------------------------------------------------------------------------- #

@pytest.fixture
def temp_user_id() -> str:
    """Registra um usuário temporário e retorna o ID."""
    email = f"role_test_{uuid.uuid4().hex[:8]}@pytest.local"
    r = requests.post(
        f"{BASE_URL}/api/auth/register",
        json={"name": "Role Test User", "email": email, "password": "temp123"},
    )
    assert r.status_code == 201
    return r.json()["user"]["id"]


def test_promote_user_to_admin(admin_headers, temp_user_id):
    r = requests.patch(
        f"{BASE_URL}/api/admin/users/{temp_user_id}/role",
        json={"role": "admin"},
        headers=admin_headers,
    )
    assert r.status_code == 200
    assert r.json()["role"] == "admin"
    # Reverte
    requests.patch(
        f"{BASE_URL}/api/admin/users/{temp_user_id}/role",
        json={"role": "user"},
        headers=admin_headers,
    )


def test_demote_admin_to_user(admin_headers, temp_user_id):
    # Promove primeiro
    requests.patch(
        f"{BASE_URL}/api/admin/users/{temp_user_id}/role",
        json={"role": "admin"},
        headers=admin_headers,
    )
    r = requests.patch(
        f"{BASE_URL}/api/admin/users/{temp_user_id}/role",
        json={"role": "user"},
        headers=admin_headers,
    )
    assert r.status_code == 200
    assert r.json()["role"] == "user"


def test_cannot_change_own_role(admin_headers, admin_token):
    # Pega o ID do próprio admin
    me_r = requests.get(f"{BASE_URL}/api/user/me", headers=admin_headers)
    admin_id = me_r.json()["id"]

    r = requests.patch(
        f"{BASE_URL}/api/admin/users/{admin_id}/role",
        json={"role": "user"},
        headers=admin_headers,
    )
    assert r.status_code == 422


def test_update_role_user_not_found(admin_headers):
    r = requests.patch(
        f"{BASE_URL}/api/admin/users/{uuid.uuid4()}/role",
        json={"role": "admin"},
        headers=admin_headers,
    )
    assert r.status_code == 404


def test_update_role_invalid_value(admin_headers, temp_user_id):
    r = requests.patch(
        f"{BASE_URL}/api/admin/users/{temp_user_id}/role",
        json={"role": "superuser"},
        headers=admin_headers,
    )
    assert r.status_code == 422


def test_update_role_forbidden_for_user(user_headers, temp_user_id):
    r = requests.patch(
        f"{BASE_URL}/api/admin/users/{temp_user_id}/role",
        json={"role": "admin"},
        headers=user_headers,
    )
    assert r.status_code == 403
