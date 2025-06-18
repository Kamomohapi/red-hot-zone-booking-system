from fastapi import APIRouter, Depends, HTTPException,Security
from services.service_salon_services import create_service_logic,get_services,update_services,get_booking_services
from auth.auth_middleware import get_current_user
from models.services_model import Service

service_endpoints = APIRouter(prefix="", tags=["Salon Services"])

@service_endpoints.post("/create_service")
def create_service(service_data: Service,
                         current_user: dict = Depends(get_current_user)):
    print("current_user:", current_user)
    if "email" not in current_user:
        raise HTTPException(status_code=401, detail="User not authenticated")
    user_email = current_user["email"]
    return create_service_logic(service_data, user_email)

@service_endpoints.get("/get_services")
def get_services_logic(user=Security(get_current_user)):
    user_id = user.get("user_id") or user.get("_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")
    return get_services(str(user_id))

@service_endpoints.patch("/modify/services/{service_id}")
async def update_services_details(service_id:str, 
                                  service:Service, 
                                  user=Security(get_current_user)):
   
    user_id = user.get("user_id")

    if not user_id:
        raise HTTPException(status_code=401,detail="User not authenticated")
    
    updated = await update_services(service_id,user_id,service)

    if not updated:
        raise HTTPException(status_code=500, detail="Failed to update salon branding")
    
    return {"status": "ok", "message": "Salon service details updated successfully"}

@service_endpoints.get("/get/booking/services/{slug}")
def get_services_by_salon_slug(slug:str):
    return get_booking_services(slug)