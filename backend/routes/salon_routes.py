from fastapi import APIRouter, HTTPException, Security
from models.salon_model import Salon, BrandingUpdate
from services.salon_services import create_salon, get_salon_website, get_salon,update_salon_branding,get_salon_by_slug
from auth.auth_middleware import get_current_user

salon_endpoints = APIRouter(prefix="", tags=["Salon"])

@salon_endpoints.post("/create/salon")
def create_salon_route(
    salon: Salon,
    user=Security(get_current_user)
):
    user_id = user.get("user_id")

    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")

    # Now pass to service which will attach user_id and insert
    return create_salon(user_id=user_id, salon_data=salon)

@salon_endpoints.get("/salon/website/")
def get_website(user=Security(get_current_user)):
    user_id = user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")

    website = get_salon_website(user_id)
    
    return {"website": website}

@salon_endpoints.get("/salon/info/")
def get_salon_info(user=Security(get_current_user)):
    user_id = user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")

    salon_info = get_salon(user_id)
    
    if salon_info.get("status") == "error":
        raise HTTPException(status_code=404, detail=salon_info["message"])
    
    return salon_info

@salon_endpoints.patch("/salon/update/branding")
async def patch_salon_branding(
    branding: BrandingUpdate,  # Assuming BrandingUpdate is a dict for simplicity
    user=Security(get_current_user)
):
    user_id = user.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User not authenticated")

    # Call the service to update branding
    updated = await update_salon_branding(user_id, branding)
    
    if not updated:
        raise HTTPException(status_code=500, detail="Failed to update salon branding")
    
    return {"status": "ok", "message": "Salon branding updated successfully"}

@salon_endpoints.get("/api/salon/{slug}")
def get_salon_by_slug_route(slug: str):
    salon = get_salon_by_slug(slug)
    if not salon:
        raise HTTPException(status_code=404, detail="Salon not found")
    
    return salon