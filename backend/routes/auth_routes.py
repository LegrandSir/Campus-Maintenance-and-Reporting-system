# backend/routes/auth_routes.py
from flask import Blueprint, request, jsonify
from services.auth_service import verify_login

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Call the service layer (Separation of Concerns)
    result = verify_login(email, password)

    if result.get("success"):
        return jsonify(result), 200
    else:
        return jsonify({"error": result.get("message")}), 401