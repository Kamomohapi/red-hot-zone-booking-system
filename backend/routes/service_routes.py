from fastapi import APIRouter, Depends, HTTPException
from services.service_services import create_service_logic
from auth.auth_middleware import get_current_user
from models.services_model import Service

service_endpoints = APIRouter(prefix="/api", tags=["Salon Services"])
@service_endpoints.post("/create_service")
def create_service(service_data: Service,
                         current_user: dict = Depends(get_current_user)):
    print("current_user:", current_user)
    if "email" not in current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    user_email = current_user["email"]
    return create_service_logic(service_data, user_email)
