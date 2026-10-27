# backend/app.py
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Allows the React frontend to access this API

@app.route('/')
def home():
    return {"message": "CampusFix API is running!"}

if __name__ == '__main__':
    app.run(debug=True, port=5000)