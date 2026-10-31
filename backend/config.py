import os
from dotenv import load_dotenv

# Force Python to read variables from the .env file
load_dotenv()

class Config:
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'super-secret-campusfix-key-2026')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://postgres:password@localhost/campusfix')
    SQLALCHEMY_TRACK_MODIFICATIONS = False