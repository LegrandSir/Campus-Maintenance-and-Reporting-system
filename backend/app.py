
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import Config
from models import db

# Explicitly import models so SQLAlchemy registers them
from models.user import User
from models.ticket import Ticket
from models.notice import Notice
from routes.auth_routes import auth_bp
from routes.ticket_routes import ticket_bp
from routes.notice_routes import notice_bp


app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
jwt = JWTManager(app)

# Initialize Database and Migrate
db.init_app(app)
migrate = Migrate(app, db)

# Register the routes
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(ticket_bp, url_prefix='/api/tickets')
app.register_blueprint(notice_bp, url_prefix='/api/notices')


@app.route('/')
def home():
    return {"message": "CampusFix API is running!"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)