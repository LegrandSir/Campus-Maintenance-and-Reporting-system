import os, pytest
from dotenv import load_dotenv

# Read the real DATABASE_URL from backend/.env, then point it at the TEST database,
# so no password is written in this file and campusfix_db is never touched.
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
os.environ["DATABASE_URL"] = os.environ["DATABASE_URL"].rsplit("/", 1)[0] + "/campusfix_test"

# ---------- CONFIG (matches seed.py) ----------
USERS = {
    "student":     ("student@usiu.ac.ke", "password123"),
    "maintenance": ("maintenance@usiu.ac.ke", "password123"),
    "admin":       ("admin@usiu.ac.ke", "password123"),
}
# seed.py has no Staff user, so the fixture below creates one for the RBAC test.
STAFF = ("staff@usiu.ac.ke", "password123")
STAFF_NAME = "Test Staff Member"
STAFF_ROLE = "Staff"
TOKEN_KEY = "token"   # key in the login response; change if yours differs
# ----------------------------------------------

from app import app
from models import db
from models.user import User
from werkzeug.security import generate_password_hash
import seed

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.app_context():
        assert db.engine.url.database == "campusfix_test", "Refusing to run on a non-test database"
        db.drop_all()
        db.create_all()
        seed.seed_database()
        db.session.add(User(name=STAFF_NAME, email=STAFF[0],
                            password_hash=generate_password_hash(STAFF[1]), role=STAFF_ROLE))
        db.session.commit()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

def login(client, email, password):
    return client.post("/api/auth/login", json={"email": email, "password": password})

def headers(client, role):
    email, pw = USERS.get(role) or STAFF
    token = login(client, email, pw).get_json()[TOKEN_KEY]
    return {"Authorization": f"Bearer {token}"}

def make_ticket(client, role="student", **extra):
    body = {"title": "Broken light", "location": "Block A",
            "priority": "High Priority", "description": "Flickering"}
    body.update(extra)
    r = client.post("/api/tickets", json=body, headers=headers(client, role))
    assert r.status_code == 201, r.get_data(as_text=True)
    data = r.get_json()
    if isinstance(data, dict) and "id" not in data:
        # response is wrapped, e.g. {"ticket": {...}}
        data = next((v for v in data.values() if isinstance(v, dict) and "id" in v), data)
    if not isinstance(data, dict) or "id" not in data:
        # response has no ticket at all, so fetch the newest one from the list
        tickets = client.get("/api/tickets", headers=headers(client, "admin")).get_json()
        if isinstance(tickets, dict):
            tickets = next((v for v in tickets.values() if isinstance(v, list)), [])
        data = max(tickets, key=lambda t: t["id"])
    return data