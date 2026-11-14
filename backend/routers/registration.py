import sqlite3
import bcrypt
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection
router = APIRouter()
# users = {}  # temporary

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
    return {"message": "User created", "email": data.email}