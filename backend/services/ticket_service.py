# backend/services/ticket_service.py
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
            user_id=user.id
        )
        db.session.add(new_ticket)
        db.session.commit()
        return {"success": True, "message": "Ticket created successfully", "ticket_id": new_ticket.id}, 201
    except Exception as e:
        db.session.rollback()
        return {"success": False, "error": str(e)}, 500