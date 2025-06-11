from models.booking_model import Booking
from config.config import bookingCollection, salonCollection
from services.email_utils import send_email  # assume you have this
from datetime import datetime

def create_booking(booking_data: Booking) -> dict:
    # Convert booking model to dict
    booking_dict = booking_data.dict()

    # 1. Lookup salon from MongoDB using slug
    salon = salonCollection.find_one({"slug": booking_dict["salon_slug"]})
    if not salon:
        return {
            "status": "error",
            "message": f"Salon with slug '{booking_dict['salon_slug']}' not found."
        }

    # 2. Insert booking
    result = bookingCollection.insert_one(booking_dict)

    # 3. Notify the salon owner via email
    send_email(
        to=salon["email"],
        subject="New Booking Received",
        body=(
            f"Hello {salon['name']},\n\n"
            f"You have received a new booking from {booking_dict['client_name']}.\n"
            f"Service: {booking_dict['service_type']}\n"
            f"Date: {booking_dict['date']} at {booking_dict['time_slot']}\n"
            f"Client Contact: {booking_dict['client_email']}, {booking_dict['client_phone']}\n\n"
            f"Regards,\n{salon['name']} Booking System"
        )
    )

    return {
        "status": "ok",
        "message": "Booking created and owner notified",
        "booking_id": str(result.inserted_id)
    }

def get_bookings_by_salon_slug(salon_slug: str) -> dict:
    # 1. Lookup salon from MongoDB using slug
    salon = salonCollection.find_one({"slug": salon_slug})
    if not salon:
        return {
            "status": "error",
            "message": f"Salon with slug '{salon_slug}' not found."
        }

    # 2. Fetch bookings for the salon
    bookings = list(bookingCollection.find({"salon_slug": salon_slug}))

    # 3. Serialize bookings
    serialized_bookings = [
        {
            "client_name": booking["client_name"],
            "client_email": booking["client_email"],
            "client_phone": booking["client_phone"],
            "date": booking["date"],
            "time_slot": booking["time_slot"],
            "service_type": booking["service_type"]
        } for booking in bookings
    ]

    return {
        "status": "ok",
        "bookings": serialized_bookings
    }

def get_booking_by_date(salon_slug: str, date: str) -> dict:
    # 1. Lookup salon from MongoDB using slug
    salon = salonCollection.find_one({"slug": salon_slug})
    if not salon:
        return {
            "status": "error",
            "message": f"Salon with slug '{salon_slug}' not found."
        }

    # 2. Fetch bookings for the salon on the specified date
    bookings = list(bookingCollection.find({"salon_slug": salon_slug, "date": date}))

    # 3. Serialize bookings
    serialized_bookings = [
        {
            "client_name": booking["client_name"],
            "client_email": booking["client_email"],
            "client_phone": booking["client_phone"],
            "time_slot": booking["time_slot"],
            "service_type": booking["service_type"]
        } for booking in bookings
    ]

    return {
        "status": "ok",
        "bookings": serialized_bookings
    }

def get_todays_booking_count(salon_slug: str) -> dict:
    # 1. Get today's date in "DD-MM-YYYY" format
    today = datetime.now().strftime("%d-%m-%Y")

    # 2. Look up salon by slug
    salon = salonCollection.find_one({"slug": salon_slug})
    if not salon:
        return {
            "status": "error",
            "message": f"Salon with slug '{salon_slug}' not found."
        }

    # 3. Query bookings for today
    count = bookingCollection.count_documents({
        "salon_slug": salon_slug,
        "date": today
    })

    # 4. Return count
    return {
        "status": "ok",
        "date": today,
        "booking_count": count
    }

def get_bookings_count(salon_slug: str) -> dict:
    # 1. Look up salon by slug
    salon = salonCollection.find_one({"slug": salon_slug})
    if not salon:
        return {
            "status": "error",
            "message": f"Salon with slug '{salon_slug}' not found."
        }

    # 2. Count all bookings for the salon
    count = bookingCollection.count_documents({"salon_slug": salon_slug})

    # 3. Return count
    return {
        "status": "ok",
        "booking_count": count
    }