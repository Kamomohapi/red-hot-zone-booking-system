from config.config import serviceCollection, userCollection, salonCollection
from fastapi import HTTPException
from bson import ObjectId
from models.services_model import Service

def create_service_logic(service_data, user_email: str) -> dict:
    try:
        # 1. Find the user by email
        user = userCollection.find_one({"email": user_email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user["_id"]

        # 2. Find the salon owned by this user
        # Convert user_id to string for the query
        salon = salonCollection.find_one({"user_id": str(user_id)})
        if not salon:
            raise HTTPException(status_code=404, detail="Salon not found for user")
        salon_id = salon["_id"]

        # 3. Create the service document, linking both user and salon
        service_doc = {
            "name": service_data.name,
            "description": service_data.description,
            "price": service_data.price,
            "duration": service_data.duration,
            "category": service_data.category,
            "is_active": service_data.is_active,
            "user_id": user_id,      # Link to the user
            "salon_id": salon_id  # Link to the salon
        }

        # 4. Insert the service into the collection
        result = serviceCollection.insert_one(service_doc)

        return {
            "status": "ok",
            "message": "Service created successfully",
            "service_id": str(result.inserted_id)
        }
    except Exception as e:
        print(f"Internal server error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


def get_services(user_id: str) -> dict:
    try:
        query_user_id = ObjectId(user_id)
    except Exception:
        return {"status": "error", "message": "Invalid user_id format"}
    service_by_user = list(serviceCollection.find({"user_id": query_user_id}))

    if not service_by_user:
        return {"status": "error", "message": "No services found for this user"}

    serialized_services = [
        {
            "id": str(service["_id"]),
            "name": service["name"],
            "description": service["description"],
            "price": service["price"],
            "duration": service["duration"],
            "category": service["category"],
            "is_active": service["is_active"],
            "user_id": str(service["user_id"]),
            "salon_id": str(service["salon_id"]),
        }
        for service in service_by_user
    ]
    return {
        "status": "ok",
        "services": serialized_services
    }

async def update_services(service_id:str, user_id:str, service:Service) -> bool:

   update_fields = {key: value for key, value in service.dict().items() if value is not None}

   update_fields.pop("id", None)
   update_fields.pop("user_id", None)
   update_fields.pop("salon_id", None)

   if not update_fields:
        return False
   
   try:
        query = {"_id": ObjectId(service_id), "user_id": ObjectId(user_id)}
   except Exception:
        return False

   result = serviceCollection.update_one(
       query,
       {"$set":update_fields}
   )

   return result.modified_count > 0


