# backend/routes/ticket_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.ticket import Ticket
from services.ticket_service import create_new_ticket

ticket_bp = Blueprint('tickets', __name__)

def ticket_to_dict(t):
    return {
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "location": t.location,
        "status": t.status,
        "priority": t.priority,
        "reported_date": t.reported_date.isoformat() if t.reported_date else None,
        "user_id": t.user_id,
    }

# strict_slashes=False prevents 308 redirects while accepting both URL formats
@ticket_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_tickets():
    tickets = Ticket.query.order_by(Ticket.reported_date.desc()).all()
    return jsonify([ticket_to_dict(t) for t in tickets]), 200

@ticket_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_ticket():
    data = request.get_json()
    current_user = get_jwt_identity() 
    
    result, status_code = create_new_ticket(data, current_user['email'])
    return jsonify(result), status_code