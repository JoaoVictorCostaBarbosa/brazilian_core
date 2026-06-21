"""
Fixtures compartilhadas entre todos os testes de integração.
Os testes rodam contra o servidor FastAPI em http://localhost:8000.
"""
import uuid
import pytest
import requests

BASE_URL = "http://localhost:8000"

ADMIN_EMAIL = "admin@email.com"
ADMIN_PASSWORD = "admin123"

TEST_USER_EMAIL = f"test_{uuid.uuid4().hex[:8]}@pytest.local"
TEST_USER_PASSWORD = "pytest_pass_123"
TEST_USER_NAME = "Pytest User"


# --------------------------------------------------------------------------- #
# Helpers                                                                      #
# --------------------------------------------------------------------------- #

def auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}", "accept": "application/json"}


# --------------------------------------------------------------------------- #
# Session-scoped fixtures (criados uma vez por sessão de testes)               #
# --------------------------------------------------------------------------- #

@pytest.fixture(scope="session")
def admin_token() -> str:
    r = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
    )
    assert r.status_code == 200, f"Login admin falhou: {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def admin_headers(admin_token: str) -> dict:
    return auth_headers(admin_token)


@pytest.fixture(scope="session")
def user_token() -> str:
    """Registra um usuário temporário para os testes e retorna o token."""
    r = requests.post(
        f"{BASE_URL}/api/auth/register",
        json={
            "name": TEST_USER_NAME,
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD,
        },
    )
    assert r.status_code == 201, f"Registro de usuário de teste falhou: {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def user_headers(user_token: str) -> dict:
    return auth_headers(user_token)


@pytest.fixture(scope="session")
def user_id(user_token: str, user_headers: dict) -> str:
    r = requests.get(f"{BASE_URL}/api/user/me", headers=user_headers)
    assert r.status_code == 200
    return r.json()["id"]


@pytest.fixture(scope="session")
def sample_product(admin_headers: dict) -> dict:
    """Cria um produto de teste e o remove ao final da sessão."""
    payload = {
        "name": f"Pytest Fragrance {uuid.uuid4().hex[:6]}",
        "price": 199.90,
        "description": "Produto criado pelos testes automatizados",
        "stock_quantity": 10,
        "url_img": "https://example.com/test.jpg",
    }
    r = requests.post(f"{BASE_URL}/api/products/", json=payload, headers=admin_headers)
    assert r.status_code == 201, f"Criação de produto de teste falhou: {r.text}"
    product = r.json()
    yield product
    # Cleanup
    requests.delete(f"{BASE_URL}/api/products/{product['id']}", headers=admin_headers)


@pytest.fixture(scope="session")
def sample_coupon(admin_headers: dict) -> dict:
    """Cria um cupom de teste e o remove ao final da sessão."""
    payload = {
        "code": f"PYTEST{uuid.uuid4().hex[:4].upper()}",
        "discount_percentage": 10,
        "expires_at": "2099-12-31",
    }
    r = requests.post(f"{BASE_URL}/api/coupon/", json=payload, headers=admin_headers)
    assert r.status_code == 201, f"Criação de cupom falhou: {r.text}"
    coupon = r.json()
    yield coupon
    requests.delete(f"{BASE_URL}/api/coupon/{coupon['id']}", headers=admin_headers)
