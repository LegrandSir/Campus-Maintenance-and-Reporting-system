# backend/routes/notice_routes.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db
from models.notice import Notice
from models.user import User

notice_bp = Blueprint('notices', __name__)


def notice_to_dict(n):
    return {
        "id": n.id,
        "title": n.title,
        "message": n.message,
        "created_date": n.created_date.isoformat() if n.created_date else None,
        "admin_id": n.admin_id,
    }


@notice_bp.route('', methods=['POST'])
@jwt_required()
def create_notice():
    identity = get_jwt_identity()  # {"email": ..., "role": ...}

    if str(identity.get("role", "")).lower() != "admin":
        return jsonify({"message": "Admins only"}), 403

    admin = User.query.filter_by(email=identity["email"]).first()
    if not admin:
        return jsonify({"message": "Admin not found"}), 404

    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    message = (data.get("message") or "").strip()

    if not title or not message:
        return jsonify({"message": "title and message are required"}), 400

    notice = Notice(title=title, message=message, admin_id=admin.id)
    db.session.add(notice)
    db.session.commit()

    return jsonify(notice_to_dict(notice)), 201


@notice_bp.route('', methods=['GET'])
@jwt_required()
def list_notices():
    notices = Notice.query.order_by(Notice.created_date.desc()).all()
    return jsonify([notice_to_dict(n) for n in notices]), 200