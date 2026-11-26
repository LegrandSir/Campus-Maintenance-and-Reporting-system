import pytest
from conftest import login, USERS, TOKEN_KEY

def test_wrong_password(client):
    assert login(client, USERS["student"][0], "wrong").status_code == 401

def test_unknown_email(client):
    assert login(client, "nobody@usiu.ac.ke", "x").status_code == 401

def test_missing_fields(client):
    assert client.post("/api/auth/login", json={"email": "a@b.com"}).status_code == 400
    assert client.post("/api/auth/login", json={"password": "x"}).status_code == 400

def test_protected_routes_need_token(client):
    assert client.get("/api/tickets").status_code == 401
    assert client.post("/api/tickets", json={}).status_code == 401

@pytest.mark.parametrize("role", ["student", "maintenance", "admin"])
def test_login_each_role(client, role):
    r = login(client, *USERS[role])
    assert r.status_code == 200
    assert TOKEN_KEY in r.get_json()