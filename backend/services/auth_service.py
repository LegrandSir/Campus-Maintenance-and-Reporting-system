# backend/services/auth_service.py
from flask_jwt_extended import create_access_token

def verify_login(email, password):
    # TODO: Replace with real database query in the next step
    # Mock database check based on the Figma UI requirements
    if email == "student@usiu.ac.ke" and password == "password123":
        
        # Generate the JWT token
        access_token = create_access_token(identity={"email": email, "role": "Student"})
        
        return {
            "success": True,
            "token": access_token,
            "user": {"email": email, "name": "Paul Wafula", "role": "Student"}
        }
    
    return {"success": False, "message": "Invalid email or password"}