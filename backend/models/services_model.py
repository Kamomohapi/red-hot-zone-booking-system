from pydantic import BaseModel
from typing import Optional

class Service(BaseModel):
    id: Optional[str] = None  # Unique identifier for the service, auto-generated if not provided
    salon_id: Optional[str] = None  # ID of the salon offering the service
    user_id: Optional[str] = None  # ID of the user (owner) who created the service
    name: str  # Name of the service
    description: Optional[str] = None  # Description of the service
    duration: Optional[int] = None  # Duration of the service in minutes
    price: float  # Price of the service
    category: Optional[str] = None  # Category of the service, e.g. "Haircut", "Coloring"
    is_active: Optional[bool] = True  # Whether the service is currently active or not