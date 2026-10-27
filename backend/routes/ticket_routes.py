# backend/routes/ticket_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.ticket import Ticket

ticket_bp = Blueprint('tickets', __name__)


def ticket_to_dict(t):
    return {
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "location": t.location,
        "status": t.status,
        "priority": t.priority,
        "reported_date": t.reported_date.isoformat(),
        "user_id": t.user_id,
    }


@ticket_bp.route('', methods=['POST'])
@jwt_required()
def create_ticket():
    data = request.get_json() or {}

    missing = [f for f in ('title', 'description', 'location') if not data.get(f)]
    if missing:
        return jsonify({"error": "Missing: " + ", ".join(missing)}), 400

    ticket = Ticket(
        title=data['title'],
        description=data['description'],
        location=data['location'],
        priority=data.get('priority', 'Medium Priority'),
        user_id=int(get_jwt_identity()),
    )
    db.session.add(ticket)
    db.session.commit()
    return jsonify(ticket_to_dict(ticket)), 201


@ticket_bp.route('', methods=['GET'])
@jwt_required()
def get_tickets():
    tickets = Ticket.query.order_by(Ticket.reported_date.desc()).all()
    return jsonify([ticket_to_dict(t) for t in tickets]), 200