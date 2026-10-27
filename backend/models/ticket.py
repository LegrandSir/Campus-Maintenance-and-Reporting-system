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
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)