# backend/seed.py
from app import app
from models import db
from models.user import User
from werkzeug.security import generate_password_hash

def seed_database():
    with app.app_context():
        # Prevent duplicate seeding if the script is run twice
        if User.query.first():
            print("Database is already seeded with users.")
            return

        # 1. Student Account
        student = User(
            name="Paul Wafula",
            email="student@usiu.ac.ke",
            password_hash=generate_password_hash("password123"),
            role="Student"
        )
        
        # 2. Maintenance Account
        maintenance = User(
            name="Campus Facility Desk",
            email="maintenance@usiu.ac.ke",
            password_hash=generate_password_hash("password123"),
            role="Maintenance"
        )
        
        # 3. Admin Account
        admin = User(
            name="ICT Administrator",
            email="admin@usiu.ac.ke",
            password_hash=generate_password_hash("password123"),
            role="Admin"
        )

        # Add and save to the database
        db.session.add_all([student, maintenance, admin])
        db.session.commit()
        
        print("✅ Demo accounts successfully seeded!")

if __name__ == '__main__':
    seed_database()