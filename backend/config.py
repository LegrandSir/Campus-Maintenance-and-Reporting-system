# backend/config.py
import os

class Config:
    # In a real production app, this comes from a .env file
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:password@localhost/campusfix')
    SQLALCHEMY_TRACK_MODIFICATIONS = False