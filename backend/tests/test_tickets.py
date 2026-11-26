from conftest import make_ticket, headers

IMG = "data:image/png;base64,iVBORw0KGgo="

def test_create_without_photo(client):
    t = make_ticket(client)
    assert t["title"] == "Broken light"

def test_create_with_photo(client):
    t = make_ticket(client, image_url=IMG)
    assert t["image_url"] == IMG

def test_get_single_ticket(client):
    t = make_ticket(client, image_url=IMG)
    r = client.get(f"/api/tickets/{t['id']}", headers=headers(client, "admin"))
    assert r.status_code == 200
    data = r.get_json()
    for key in ("title", "location", "priority", "description", "image_url", "assigned_to"):
        assert key in data

def test_get_missing_ticket_404(client):
    assert client.get("/api/tickets/999999", headers=headers(client, "admin")).status_code == 404

def test_delete_ticket(client):
    t = make_ticket(client)
    h = headers(client, "admin")
    assert client.delete(f"/api/tickets/{t['id']}", headers=h).status_code == 200
    assert client.get(f"/api/tickets/{t['id']}", headers=h).status_code == 404