# backend/app.py
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth_routes import auth_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
jwt = JWTManager(app)

# Register the routes
app.register_blueprint(auth_bp, url_prefix='/api/auth')

@app.route('/')
def home():
    return {"message": "CampusFix API is running!"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)