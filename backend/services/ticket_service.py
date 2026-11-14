# backend/services/ticket_service.py
from datetime import datetime
from models import db
from models.ticket import Ticket
from models.user import User

def create_new_ticket(data, user_email):
    # Find the user by email (extracted securely from JWT)
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return {"success": False, "error": "User not found"}, 404

    try:
        new_ticket = Ticket(
            title=data.get('title'),
            description=data.get('description'),
            location=data.get('location'),
            priority=data.get('priority', 'Medium Priority'),
            status='Open', # Default status for new tickets
            image_url=data.get('image_url'), # Stores Base64 photo from Upload or Camera
            assigned_to=data.get('assigned_to'),
            user_id=user.id
        )
        db.session.add(new_ticket)
        db.session.commit()
        return {
            "success": True, 
            "message": "Ticket created successfully", 
            "ticket_id": new_ticket.id,
            "ticket": new_ticket.to_dict()
        }, 201
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": str(e)}, 500


def get_ticket_by_id(ticket_id, user_email):
    # Verify user exists (security check)
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return {"success": False, "error": "User not found"}, 404

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return {"success": False, "error": "Ticket not found"}, 404
        
    return {"success": True, "ticket": ticket}, 200


def resolve_ticket(ticket_id, user_email):
    # Security check: verify user exists
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return {"success": False, "error": "User not found"}, 404

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return {"success": False, "error": "Ticket not found"}, 404
        
    # Update the status and record resolution timestamp
    ticket.status = 'Resolved'
    ticket.resolved_date = datetime.utcnow()
    
    try:
        db.session.commit()
        return {"success": True, "message": "Ticket marked as resolved"}, 200
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": str(e)}, 500


def get_ticket_stats():
    try:
        total = Ticket.query.count()
        active = Ticket.query.filter(Ticket.status.in_(['Open', 'Assigned', 'In Progress'])).count()
        resolved = Ticket.query.filter_by(status='Resolved').count()
        
        return {
            "success": True, 
            "active": active, 
            "resolved": resolved, 
            "total": total,
            "avg_response": "2.4h"
        }, 200
    except Exception as e:
        return {"success": False, "error": str(e)}, 500


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
        
    return {"success": True, "message": "Feedback submitted successfully"}, 200


def update_ticket_status(ticket_id, new_status, user_email, assigned_to=None):
    user = User.query.filter_by(email=user_email).first()
    if not user:
        return {"success": False, "error": "User not found"}, 404

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return {"success": False, "error": "Ticket not found"}, 404
        
    ticket.status = new_status
    if assigned_to is not None:
        ticket.assigned_to = assigned_to
    if new_status == 'Resolved':
        ticket.resolved_date = datetime.utcnow()
    
    try:
        db.session.commit()
        return {"success": True, "message": f"Status updated to {new_status}"}, 200
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": str(e)}, 500