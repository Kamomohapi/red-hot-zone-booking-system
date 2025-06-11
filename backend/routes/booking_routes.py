from fastapi import APIRouter, HTTPException, Security
from models.booking_model import Booking
from services.booking_services import create_booking, get_bookings_by_salon_slug,get_todays_booking_count, get_bookings_count

booking_endpoints = APIRouter(prefix="/api", tags=["Booking"])

@booking_endpoints.post("/create/booking")
def create_booking_route(
    booking: Booking
):
    try:
        return create_booking(booking_data=booking)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@booking_endpoints.get("/salon/bookings/{salon_slug}")
def get_bookings_by_salon_slug_route(salon_slug: str):
    try:
        return get_bookings_by_salon_slug(salon_slug=salon_slug)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@booking_endpoints.get("salon/bookings/today/{salon_slug}")
def get_todays_bookings(salon_slug: str):
    try:
        return get_todays_booking_count(salon_slug=salon_slug)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@booking_endpoints.get("/salon/bookings/total/{salon_slug}")
def get_total_bookings(salon_slug: str):
    try:
        bookings = get_bookings_count(salon_slug=salon_slug)
        return {"total_bookings": bookings["booking_count"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))