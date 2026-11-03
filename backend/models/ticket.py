from models import db
from datetime import datetime

class Ticket(db.Model):
    __tablename__ = 'tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='Open') # Open, In Progress, Resolved
    priority = db.Column(db.String(50), default='Medium Priority')
    reported_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # New column for average response time calculations
    resolved_date = db.Column(db.DateTime, nullable=True) 
    # Add this below your other columns (like status, priority)
    assigned_to = db.Column(db.String(100), nullable=True)
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "status": self.status,
            "priority": self.priority,
            # Format dates to strings if they exist
            "reported_date": self.reported_date.isoformat() if self.reported_date else None,
            "resolved_date": self.resolved_date.isoformat() if self.resolved_date else None,
            "assigned_to": self.assigned_to,
            "user_id": self.user_id
        }