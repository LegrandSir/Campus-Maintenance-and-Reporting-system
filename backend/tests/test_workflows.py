from conftest import make_ticket, headers

def test_escalate(client):
    t = make_ticket(client)
    h = headers(client, "admin")
    assert client.patch(f"/api/tickets/{t['id']}/escalate", headers=h).status_code == 200
    got = client.get(f"/api/tickets/{t['id']}", headers=h).get_json()
    assert got["priority"] == "Urgent Priority"

def test_resolve(client):
    t = make_ticket(client)
    h = headers(client, "maintenance")
    assert client.patch(f"/api/tickets/{t['id']}/resolve", headers=h).status_code == 200
    got = client.get(f"/api/tickets/{t['id']}", headers=h).get_json()
    assert got["status"] == "Resolved"
    assert got["resolved_date"] is not None

def test_status_and_assignment(client):
    t = make_ticket(client)
    h = headers(client, "admin")
    for status in ("Assigned", "In Progress"):
        r = client.patch(f"/api/tickets/{t['id']}/status", headers=h,
                         json={"status": status, "assigned_to": "Some Person"})
        assert r.status_code == 200
        got = client.get(f"/api/tickets/{t['id']}", headers=h).get_json()
        assert got["status"] == status
        assert got["assigned_to"] == "Some Person"

def test_feedback(client):
    t = make_ticket(client)
    h = headers(client, "student")
    client.patch(f"/api/tickets/{t['id']}/resolve", headers=headers(client, "admin"))
    r = client.post(f"/api/tickets/{t['id']}/feedback", headers=h,
                    json={"rating": 5, "comment": "Fixed quickly"})
    assert r.status_code == 200