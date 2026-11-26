from models import db
from datetime import datetime

class Ticket(db.Model):
    __tablename__ = 'tickets'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='Open')  # Open, Assigned, In Progress, Resolved
    priority = db.Column(db.String(50), default='Medium Priority')
    reported_date = db.Column(db.DateTime, default=datetime.utcnow)

    # New column for average response time calculations
    resolved_date = db.Column(db.DateTime, nullable=True)

    # Base64 photo (Text, because Base64 images are far longer than 255 characters)
    image_url = db.Column(db.Text, nullable=True)

    # Name of the staff member the ticket is assigned to
    assigned_to = db.Column(db.String(100), nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)