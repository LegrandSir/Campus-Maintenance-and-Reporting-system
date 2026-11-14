# backend/routes/ticket_routes.py
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.ticket import Ticket
from models import db
from services.ticket_service import (
    create_new_ticket, 
    get_ticket_by_id, 
    resolve_ticket, 
    get_ticket_stats, 
    escalate_ticket, 
    submit_ticket_feedback
)

ticket_bp = Blueprint('tickets', __name__)

def ticket_to_dict(t):
    # Use the model's to_dict() if available, otherwise return all fields including image_url & assigned_to
    if hasattr(t, 'to_dict'):
        return t.to_dict()
    return {
        "id": t.id,
        "title": t.title,
        "description": t.description,
        "location": t.location,
        "status": t.status,
        "priority": t.priority,
        "reported_date": t.reported_date.isoformat() if t.reported_date else None,
        "resolved_date": getattr(t, 'resolved_date', None).isoformat() if getattr(t, 'resolved_date', None) else None,
        "assigned_to": getattr(t, 'assigned_to', None),
        "image_url": getattr(t, 'image_url', None),
        "user_id": t.user_id,
    }

# Helper so it works whether get_jwt_identity() is a dict or a string
def get_user_email(identity):
    return identity.get('email') if isinstance(identity, dict) else identity


# 1. GET all tickets
@ticket_bp.route('/', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_tickets():
    current_user = get_jwt_identity()
    
    # If they are Staff, ONLY return tickets assigned to them
    if isinstance(current_user, dict) and current_user.get('role') == 'Staff':
        tickets = Ticket.query.filter_by(assigned_to=current_user.get('name')).order_by(Ticket.reported_date.desc()).all()
    else:
        # Admins, Maintenance, and Students see everything
        tickets = Ticket.query.order_by(Ticket.reported_date.desc()).all()
        
    return jsonify([ticket_to_dict(ticket) for ticket in tickets]), 200


# 2. POST create a new ticket
@ticket_bp.route('/', methods=['POST'], strict_slashes=False)
@jwt_required()
def create_ticket():
    data = request.get_json()
    current_user = get_jwt_identity()
    user_email = get_user_email(current_user)
    
    result, status_code = create_new_ticket(data, user_email)
    return jsonify(result), status_code


# 3. GET dashboard stats
@ticket_bp.route('/stats', methods=['GET'], strict_slashes=False)
@jwt_required()
def ticket_stats():
    result, status_code = get_ticket_stats()
    return jsonify(result), status_code


# 4. GET a single ticket by ID
@ticket_bp.route('/<int:ticket_id>', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_single_ticket(ticket_id):
    current_user = get_jwt_identity()
    user_email = get_user_email(current_user)
    
    result, status_code = get_ticket_by_id(ticket_id, user_email)
    if status_code == 200:
        return jsonify(ticket_to_dict(result['ticket'])), 200
    return jsonify(result), status_code


# 5. DELETE a ticket by ID
@ticket_bp.route('/<int:ticket_id>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
def delete_ticket(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404
        
    db.session.delete(ticket)
    db.session.commit()
    return jsonify({"success": True, "message": "Ticket deleted"}), 200


# 6. PATCH status & assigned_to (Used by Kanban drag-and-drop and Student Cancel)
@ticket_bp.route('/<int:ticket_id>/status', methods=['PATCH', 'PUT'], strict_slashes=False)
@jwt_required()
def update_status_route(ticket_id):
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404
        
    data = request.get_json() or {}
    if 'status' in data and data['status']:
        ticket.status = data['status']
        if data['status'] == 'Resolved' and hasattr(ticket, 'resolved_date'):
            ticket.resolved_date = datetime.utcnow()
    
    if 'assigned_to' in data:
        ticket.assigned_to = data['assigned_to']
        
    db.session.commit()
    return jsonify(ticket_to_dict(ticket)), 200


# 7. PATCH resolve ticket (Used by "Mark as Resolved" button in TicketDetails)
@ticket_bp.route('/<int:ticket_id>/resolve', methods=['PATCH', 'PUT', 'POST'], strict_slashes=False)
@jwt_required()
def resolve_ticket_route(ticket_id):
    current_user = get_jwt_identity()
    user_email = get_user_email(current_user)
    
    result, status_code = resolve_ticket(ticket_id, user_email)
    return jsonify(result), status_code


# 8. PATCH escalate ticket (Used by "Escalate Issue" button in TicketDetails)
@ticket_bp.route('/<int:ticket_id>/escalate', methods=['PATCH', 'PUT', 'POST'], strict_slashes=False)
@jwt_required()
def escalate_ticket_route(ticket_id):
    current_user = get_jwt_identity()
    user_email = get_user_email(current_user)
    
    result, status_code = escalate_ticket(ticket_id, user_email)
    return jsonify(result), status_code


# 9. POST submit feedback (Used by "Submit Review" button in TicketDetails)
@ticket_bp.route('/<int:ticket_id>/feedback', methods=['POST'], strict_slashes=False)
@jwt_required()
def feedback_ticket_route(ticket_id):
    current_user = get_jwt_identity()
    user_email = get_user_email(current_user)
    data = request.get_json() or {}
    
    result, status_code = submit_ticket_feedback(ticket_id, user_email, data.get('feedback', ''))
    return jsonify(result), status_code