# backend/services/auth_service.py
from models.user import User
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token

def verify_login(email, password):
    # 1. Query the database for a user with the matching email
    user = User.query.filter_by(email=email).first()
    
    # 2. Verify the user exists and the password matches the hash
    if user and check_password_hash(user.password_hash, password):
        
        # 3. Generate the JWT token using the real database role
        access_token = create_access_token(identity={"email": user.email, "role": user.role})
        
        return {
            "success": True,
            "token": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "role": user.role
            }
        }
    
    return {"success": False, "message": "Invalid email or password"}