from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
router = APIRouter()
users = {}  # temporary

class RegisterData(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(data: RegisterData):
    if data.email in users:
        raise HTTPException(status_code=400, detail="Email already registered")
    users[data.email] = data.password
    return {"message": "User created", "email": data.email}