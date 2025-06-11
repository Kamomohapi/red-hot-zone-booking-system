from config.config import serviceCollection, userCollection, salonCollection
from fastapi import HTTPException



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
            "salon_id": salon_id     # Link to the salon
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

