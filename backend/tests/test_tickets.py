import json

def test_get_tickets_unauthorized(client):
    """Test that guests cannot view tickets without a JWT token"""
    response = client.get('/api/tickets')
    assert response.status_code == 401

def test_get_ticket_stats(client, auth_headers):
    """Test that the stats endpoint returns the correct structure"""
    response = client.get('/api/tickets/stats', headers=auth_headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert "active" in data
    assert "resolved" in data