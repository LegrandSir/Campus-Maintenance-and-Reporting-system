import pytest
import sys
import os

# Add the backend directory to the Python path so it can find app.py
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app, db
from models.user import User
from flask_jwt_extended import create_access_token

@pytest.fixture
def client():
    # Configure the app for testing
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # Use temporary memory DB
    
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            
            # Create a mock user for testing and provide a dummy password_hash
            test_user = User(
                name="Test User", 
                email="test@usiu.ac.ke", 
                role="Student", 
                password_hash="dummy_hash" # This satisfies the NotNull constraint
            )
            
            db.session.add(test_user)
            db.session.commit()
            
        yield client
        
        # Clean up after tests
        with app.app_context():
            db.session.remove()
            db.drop_all()

@pytest.fixture
def auth_headers(client):
    # Generate a mock JWT token for authorized routes
    with app.app_context():
        access_token = create_access_token(identity={'email': 'test@usiu.ac.ke', 'role': 'Student'})
        return {'Authorization': f'Bearer {access_token}'}