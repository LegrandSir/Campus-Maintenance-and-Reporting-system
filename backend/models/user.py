from models import db

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False) # e.g., 'Student', 'Maintenance', 'Admin'
    
    # Relationship to link tickets to this user
    tickets = db.relationship('Ticket', backref='author', lazy=True)