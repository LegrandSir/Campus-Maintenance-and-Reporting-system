# backend/routes/ticket_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.ticket import Ticket
from services.ticket_service import create_new_ticket, get_ticket_by_id, resolve_ticket, get_ticket_stats, escalate_ticket, submit_ticket_feedback, update_ticket_status

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
# Add this below your existing create_ticket route in backend/routes/ticket_routes.py

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
# 2. ADD THIS NEW ROUTE AT THE BOTTOM:
@ticket_bp.route('/<int:ticket_id>/resolve', methods=['PATCH'], strict_slashes=False)
@jwt_required()
def mark_ticket_resolved(ticket_id):
    current_user = get_jwt_identity()
    result, status_code = resolve_ticket(ticket_id, current_user['email'])
    return jsonify(result), status_code

def escalate_ticket(ticket_id, user_email):
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return {"success": False, "error": "User not found"}, 404

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return {"success": False, "error": "Ticket not found"}, 404
        
    ticket.priority = 'Urgent Priority'
    
    try:
        db.session.commit()
        return {"success": True, "message": "Ticket escalated successfully"}, 200
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": str(e)}, 500


def submit_ticket_feedback(ticket_id, user_email, feedback_text):
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return {"success": False, "error": "User not found"}, 404

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return {"success": False, "error": "Ticket not found"}, 404
        
    # Successfully received feedback (In a production app, you would save this to a Feedback table)
    return {"success": True, "message": "Feedback submitted successfully"}, 200

@ticket_bp.route('/<int:ticket_id>/status', methods=['PATCH'], strict_slashes=False)
@jwt_required()
def change_ticket_status(ticket_id):
    current_user = get_jwt_identity()
    data = request.get_json()
    result, status_code = update_ticket_status(ticket_id, data.get('status'), current_user['email'])
    return jsonify(result), status_code
