# backend/seed.py
from app import app
from models import db
from models.user import User
from models.ticket import Ticket
from werkzeug.security import generate_password_hash

def seed_database():
    with app.app_context():
        # 1. Seed Users (if not already seeded)
        if not User.query.first():
            student = User(name="Paul Wafula", email="student@usiu.ac.ke", password_hash=generate_password_hash("password123"), role="Student")
            maintenance = User(name="Campus Facility Desk", email="maintenance@usiu.ac.ke", password_hash=generate_password_hash("password123"), role="Maintenance")
            admin = User(name="ICT Administrator", email="admin@usiu.ac.ke", password_hash=generate_password_hash("password123"), role="Admin")
            db.session.add_all([student, maintenance, admin])
            db.session.commit()
            print("✅ Demo accounts successfully seeded!")
        else:
            print("Users already seeded.")

        # 2. Seed Tickets
        if not Ticket.query.first():
            # Fetch the student to assign as the ticket author
            student = User.query.filter_by(email="student@usiu.ac.ke").first()
            
            if student:
                ticket1 = Ticket(
                    title="Water Leakage in Freida brown bath...",
                    description="Continuous water leakage in the 2nd-floor bathroom.",
                    location="2nd Floor, Bathroom 4",
                    status="In Progress",
                    priority="Urgent Priority",
                    user_id=student.id
                )
                
                ticket2 = Ticket(
                    title="Broken AC Unit in Lab 4",
                    description="The AC is blowing warm air, making it difficult to use the lab.",
                    location="lilian beam k Ground Floor",
                    status="Open",
                    priority="High Priority",
                    user_id=student.id
                )
                
                ticket3 = Ticket(
                    title="Projector Bulb Replacement Needed",
                    description="Projector bulb is dead and needs immediate replacement for upcoming classes.",
                    location="School of business, LT2",
                    status="Resolved",
                    priority="Medium Priority",
                    user_id=student.id
                )

                db.session.add_all([ticket1, ticket2, ticket3])
                db.session.commit()
                print("✅ Sample tickets successfully seeded!")
        else:
            print("Tickets already seeded.")

if __name__ == '__main__':
    seed_database()