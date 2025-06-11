from fastapi import APIRouter
import bcrypt
from jose import jwt
import datetime
from fastapi import HTTPException
from config.settings import settings
from config.config import userCollection
from models.user_model import RegisterUser
from models.user_model import LoginUser
user_endpoints = APIRouter(prefix="/api", tags=["Users"])


JWT_SECRET = settings.JWT_SECRET
JWT_ALGORITHM = settings.JWT_ALGORITHM
@user_endpoints.get("/")
def home():
    return{
        "status": "ok",
        "message": "API is running smoothly"
    }

@user_endpoints.post("/register/user")
def register_user(user: RegisterUser):
    existing = userCollection.find_one({"email": user.email})
    if existing:
        return {
            "status": "error",
            "message": "User already exists"
        }
    
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    userCollection.insert_one({
        "email": user.email,
        "full_name": user.full_name,
        "phone_number": user.phone_number,
        "password": hashed_password.decode('utf-8')
    })
 
    
    return {
        "status": "ok",
        "message": "User registered successfully"

    }

@user_endpoints.post("/login/user")
def login_user_logic(user: LoginUser):
    db_user = userCollection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(user.password.encode(), db_user["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    payload = {
        "email": user.email,
        "user_id": str(db_user["_id"]),  # Use the MongoDB user's _id
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }

    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

    return {"status": "ok", "token": token}

@user_endpoints.get("/get/user")
def get_user(email: str):
    user = userCollection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")   
    return{
        "status": "ok",
        "user": {
            "id": str(user["_id"]),
            "email": user["email"],
            "full_name": user.get("full_name", "")
        }
    }
