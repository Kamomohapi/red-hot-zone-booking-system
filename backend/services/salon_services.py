from models.salon_model import Salon, BrandingUpdate
from config.config import salonCollection
from bson import ObjectId
from slugify import slugify
from serializer.serializer import serialize_mongo_document  
from fastapi import HTTPException, Security
from dotenv import load_dotenv
import os
load_dotenv()

BASE_BOOKING_URL = os.getenv("CLIENT_URL")

def create_salon(user_id: str, salon_data: Salon) -> dict:
    def create_unique_slug(name: str, existing_slugs: set) -> str:
        base_slug = slugify(name)
        slug = base_slug
        counter = 1
        while slug in existing_slugs:
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug

    # 1. Get current slugs from DB
    existing_slugs = set(
        salon["slug"] for salon in salonCollection.find({}, {"slug": 1}) if "slug" in salon
    )

    # 2. Generate unique slug and booking URL
    slug = create_unique_slug(salon_data.name, existing_slugs)
    booking_url = f"{BASE_BOOKING_URL}{slug}"

    # 3. Prepare document for insert
    salon_dict = salon_data.dict()
    salon_dict["user_id"] = user_id
    salon_dict["website"] = booking_url
    salon_dict["slug"] = slug

    # 4. Insert into DB
    result = salonCollection.insert_one(salon_dict)

    return {
        "status": "ok",
        "message": "Salon created successfully",
        "salon_id": str(result.inserted_id),
        "bookingURL": booking_url
    }

def get_salon_website(user_id: str) -> str:
    salon = salonCollection.find_one({"user_id":user_id}, {"website": 1})
    if not salon or not salon.get("website"):
        return "Please create a salon first to get the website URL."
    return salon["website"]


def get_salon_by_slug(slug: str) -> str:
    salon = salonCollection.find_one({"slug": slug}, {"website": 1})
    print("DEBUG: Query result:", salon)  # Add this line for debugging

    if not salon or not salon.get("website"):
        raise HTTPException(status_code=404, detail="Salon not found")
    
    return salon


def get_salon(user_id: str) -> dict:
    salon = salonCollection.find_one({"user_id": user_id})
    if not salon:
        return {"status": "error", "message": "Salon not found"}

    serialized_salon = serialize_mongo_document(salon)
    
    return {
        "status": "ok",
        "salon": serialized_salon
    }

async def update_salon_branding(user_id: str, branding:BrandingUpdate) -> bool:
   

    # Extract only non-null fields from the branding object
    update_fields = {key: value for key, value in branding.dict().items() if value is not None}

    # If nothing to update, return False
    if not update_fields:
        return False

    # Update the specific fields inside the nested 'branding' object
    result = salonCollection.update_one(
        {"user_id": user_id},
        {"$set": {f"branding.{key}": value for key, value in update_fields.items()}}
    )

    # Return True if the document was modified
    return result.modified_count > 0
