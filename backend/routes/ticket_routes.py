# backend/routes/ticket_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.ticket import Ticket
from models.user import User
from services.ticket_service import (
    create_new_ticket, get_ticket_by_id, resolve_ticket, get_ticket_stats,
    escalate_ticket, submit_ticket_feedback, update_ticket_status,
)

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
        # getattr keeps the app from crashing if a column doesn't exist yet
        "image_url": getattr(t, "image_url", None),
        "assigned_to": getattr(t, "assigned_to", None),
        "resolved_date": t.resolved_date.isoformat() if getattr(t, "resolved_date", None) else None,
    }

@ticket_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_tickets():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user['email']).first()
    query = Ticket.query
    # Staff only see tickets assigned to them; Admin and Maintenance see all
    if user and user.role == "Staff":
        query = query.filter(Ticket.assigned_to == user.name)
    tickets = query.order_by(Ticket.reported_date.desc()).all()
    return jsonify([ticket_to_dict(t) for t in tickets]), 200

@ticket_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_ticket():
    data = request.get_json()
    current_user = get_jwt_identity()
    result, status_code = create_new_ticket(data, current_user['email'])
    return jsonify(result), status_code

@ticket_bp.route('/stats', methods=['GET'], strict_slashes=False)
@jwt_required()
def ticket_stats():
    result, status_code = get_ticket_stats()
    return jsonify(result), status_code

@ticket_bp.route('/<int:ticket_id>', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_single_ticket(ticket_id):
    current_user = get_jwt_identity()
    result, status_code = get_ticket_by_id(ticket_id, current_user['email'])
    if status_code == 200:
        return jsonify(ticket_to_dict(result['ticket'])), 200
    return jsonify(result), status_code

@ticket_bp.route('/<int:ticket_id>/resolve', methods=['PATCH'], strict_slashes=False)
@jwt_required()
def mark_ticket_resolved(ticket_id):
    current_user = get_jwt_identity()
    result, status_code = resolve_ticket(ticket_id, current_user['email'])
    return jsonify(result), status_code

@ticket_bp.route('/<int:ticket_id>/escalate', methods=['PATCH'], strict_slashes=False)
@jwt_required()
def escalate_ticket_route(ticket_id):
    current_user = get_jwt_identity()
    result, status_code = escalate_ticket(ticket_id, current_user['email'])
    return jsonify(result), status_code

@ticket_bp.route('/<int:ticket_id>/feedback', methods=['POST'], strict_slashes=False)
@jwt_required()
def submit_feedback_route(ticket_id):
    current_user = get_jwt_identity()
    data = request.get_json() or {}
    feedback_text = data.get('feedback') or data.get('comment') or ''
    result, status_code = submit_ticket_feedback(ticket_id, current_user['email'], feedback_text)
    return jsonify(result), status_code

@ticket_bp.route('/<int:ticket_id>/status', methods=['PATCH'], strict_slashes=False)
@jwt_required()
def change_ticket_status(ticket_id):
    current_user = get_jwt_identity()
    data = request.get_json() or {}
    result, status_code = update_ticket_status(
        ticket_id, data.get('status'), current_user['email'], data.get('assigned_to')
    )
    return jsonify(result), status_code

@ticket_bp.route('/<int:ticket_id>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
def delete_ticket(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404
    db.session.delete(ticket)
    db.session.commit()
    return jsonify({"success": True, "message": "Ticket deleted"}), 200