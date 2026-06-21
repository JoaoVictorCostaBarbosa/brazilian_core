"""Testes de reviews: criar, listar, atualizar e deletar."""
import uuid
import requests
import pytest

BASE_URL = "http://localhost:8000"


@pytest.fixture
def created_review(user_headers, sample_product):
    """Cria uma review e a remove ao final do teste."""
    payload = {
        "product_id": sample_product["id"],
        "rating": 4,
        "comment": "Ótimo produto de teste!",
    }
    r = requests.post(f"{BASE_URL}/api/review/", json=payload, headers=user_headers)
    # Se já existir (de um teste anterior que falhou no cleanup), deleta e recria
    if r.status_code == 409:
        # Busca a review existente para deletar
        me_r = requests.get(f"{BASE_URL}/api/review/me", headers=user_headers)
        existing = next(
            (rev for rev in me_r.json() if rev["product_id"] == sample_product["id"]),
            None,
        )
        if existing:
            requests.delete(f"{BASE_URL}/api/review/{existing['id']}", headers=user_headers)
        r = requests.post(f"{BASE_URL}/api/review/", json=payload, headers=user_headers)
    assert r.status_code == 201, f"Criação de review falhou: {r.text}"
    review = r.json()
    yield review
    requests.delete(f"{BASE_URL}/api/review/{review['id']}", headers=user_headers)


def test_create_review(user_headers, sample_product):
    payload = {
        "product_id": sample_product["id"],
        "rating": 5,
        "comment": "Excelente!",
    }
    # Remove review anterior se existir
    me_r = requests.get(f"{BASE_URL}/api/review/me", headers=user_headers)
    for rev in me_r.json():
        if rev["product_id"] == sample_product["id"]:
            requests.delete(f"{BASE_URL}/api/review/{rev['id']}", headers=user_headers)

    r = requests.post(f"{BASE_URL}/api/review/", json=payload, headers=user_headers)
    assert r.status_code == 201
    assert r.json()["rating"] == 5
    requests.delete(f"{BASE_URL}/api/review/{r.json()['id']}", headers=user_headers)


def test_create_review_invalid_rating(user_headers, sample_product):
    payload = {
        "product_id": sample_product["id"],
        "rating": 6,
        "comment": "Rating inválido",
    }
    r = requests.post(f"{BASE_URL}/api/review/", json=payload, headers=user_headers)
    assert r.status_code == 422


def test_create_duplicate_review(user_headers, created_review, sample_product):
    payload = {
        "product_id": sample_product["id"],
        "rating": 3,
        "comment": "Segunda review",
    }
    r = requests.post(f"{BASE_URL}/api/review/", json=payload, headers=user_headers)
    assert r.status_code == 409


def test_get_reviews_by_product(user_headers, created_review, sample_product):
    r = requests.get(
        f"{BASE_URL}/api/review/{sample_product['id']}/product",
        headers=user_headers,
    )
    assert r.status_code == 200
    ids = [rev["id"] for rev in r.json()]
    assert created_review["id"] in ids


def test_get_my_reviews(user_headers, created_review):
    r = requests.get(f"{BASE_URL}/api/review/me", headers=user_headers)
    assert r.status_code == 200
    ids = [rev["id"] for rev in r.json()]
    assert created_review["id"] in ids


def test_get_review_by_id(user_headers, created_review):
    r = requests.get(
        f"{BASE_URL}/api/review/{created_review['id']}",
        headers=user_headers,
    )
    assert r.status_code == 200
    assert r.json()["id"] == created_review["id"]


def test_update_review_comment(user_headers, created_review):
    r = requests.patch(
        f"{BASE_URL}/api/review/comment",
        json={"id": created_review["id"], "comment": "Comentário atualizado"},
        headers=user_headers,
    )
    assert r.status_code == 200


def test_update_review_rating(user_headers, created_review):
    r = requests.patch(
        f"{BASE_URL}/api/review/rating",
        json={"id": created_review["id"], "rating": 2},
        headers=user_headers,
    )
    assert r.status_code == 200
    assert r.json()["rating"] == 2


def test_delete_review_by_another_user(admin_headers, created_review):
    r = requests.delete(
        f"{BASE_URL}/api/review/{created_review['id']}",
        headers=admin_headers,
    )
    assert r.status_code == 403


def test_delete_review(user_headers, sample_product):
    payload = {
        "product_id": sample_product["id"],
        "rating": 1,
        "comment": "Para deletar",
    }
    me_r = requests.get(f"{BASE_URL}/api/review/me", headers=user_headers)
    for rev in me_r.json():
        if rev["product_id"] == sample_product["id"]:
            requests.delete(f"{BASE_URL}/api/review/{rev['id']}", headers=user_headers)

    create_r = requests.post(f"{BASE_URL}/api/review/", json=payload, headers=user_headers)
    assert create_r.status_code == 201
    review_id = create_r.json()["id"]

    r = requests.delete(f"{BASE_URL}/api/review/{review_id}", headers=user_headers)
    assert r.status_code == 204
