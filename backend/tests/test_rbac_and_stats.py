from conftest import make_ticket, headers, STAFF_NAME

def test_staff_sees_only_assigned(client):
    t = make_ticket(client)
    client.patch(f"/api/tickets/{t['id']}/status", headers=headers(client, "admin"),
                 json={"status": "Assigned", "assigned_to": STAFF_NAME})
    tickets = client.get("/api/tickets", headers=headers(client, "staff")).get_json()
    assert len(tickets) >= 1
    assert all(x["assigned_to"] == STAFF_NAME for x in tickets)

def test_admin_and_maintenance_see_all(client):
    make_ticket(client)
    a = client.get("/api/tickets", headers=headers(client, "admin")).get_json()
    m = client.get("/api/tickets", headers=headers(client, "maintenance")).get_json()
    assert len(a) == len(m) >= 1

def test_stats_accuracy(client):
    h = headers(client, "admin")
    before = client.get("/api/tickets/stats", headers=h).get_json()
    ids = [make_ticket(client)["id"] for _ in range(4)]
    # ids[0] stays Open
    client.patch(f"/api/tickets/{ids[1]}/status", headers=h, json={"status": "Assigned", "assigned_to": "A"})
    client.patch(f"/api/tickets/{ids[2]}/status", headers=h, json={"status": "In Progress", "assigned_to": "A"})
    client.patch(f"/api/tickets/{ids[3]}/resolve", headers=h)
    after = client.get("/api/tickets/stats", headers=h).get_json()
    assert after["active"] - before["active"] == 3
    assert after["resolved"] - before["resolved"] == 1
    assert after["total"] - before["total"] == 4