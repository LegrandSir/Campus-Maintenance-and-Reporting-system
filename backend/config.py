# backend/config.py
import os

class Config:
    # In a real production app, this comes from a .env file
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')