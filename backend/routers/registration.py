import sqlite3
import bcrypt
from flask import Blueprint, jsonify, request
from database import get_connection
from database import get_connection
bp = Blueprint("registration", __name__)
# router = APIRouter()
# users = {}  # temporary

import sqlite3

import bcrypt
from flask import Blueprint, jsonify, request

from database import get_connection

bp = Blueprint("registration", __name__)

def read_credentials():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    return email, password

@bp.post("/register")
def register():
    email, password = read_credentials()
    if "@" not in email or len(password) < 6:
        return jsonify({"detail": "Неверный email или слишком короткий пароль"}), 400

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    conn = get_connection()
    try:
        cur = conn.execute(
            "INSERT INTO users (email, hashed_password) VALUES (?, ?)",
            (email, hashed),
        )
        conn.commit()
        user_id = cur.lastrowid
    except sqlite3.IntegrityError:
        return jsonify({"detail": "Email already registered"}), 400
    finally:
        conn.close()
    return jsonify({"message": "User created", "email": email, "user_id": user_id})

@bp.post("/login")
def login():
    email, password = read_credentials()
    conn = get_connection()
    row = conn.execute(
        "SELECT id, hashed_password FROM users WHERE email = ?", (email,)
    ).fetchone()
    conn.close()
    if row is None or not bcrypt.checkpw(password.encode(), row["hashed_password"].encode()):
        return jsonify({"detail": "Неверный email или пароль"}), 401
    return jsonify({"message": "OK", "email": email, "user_id": row["id"]})

"""
class RegisterData(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(data: RegisterData):
    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    conn = get_connection()
    try:
        conn.execute("INSERT INTO users (email, hashed_password) VALUES (?, ?)", (data.email, hashed))
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        conn.close()    
    return {"message": "User created", "email": data.email} """