# backend/models/notice.py
from models import db
from datetime import datetime


class Notice(db.Model):
    __tablename__ = 'notices'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.utcnow)

    # Which admin published it
    admin_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)