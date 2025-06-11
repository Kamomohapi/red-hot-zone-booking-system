from pydantic import BaseModel, EmailStr
from typing import List, Optional

class OperatingHour(BaseModel):
    day: str  # e.g. "Monday"
    open_time: str  # e.g. "09:00"
    close_time: str  # e.g. "17:00"

class BrandingUpdate(BaseModel):
    welcome_message: Optional[str] = None
    theme_color: Optional[str] = "#f06292"
    cover_image: Optional[str] = None 

class Salon(BaseModel):
    name: str
    address: str
    phone_number: str
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    slug: Optional[str] = None  # Unique slug for the salon
    user_id: str  # link to the user (owner)
    operating_hours: List[OperatingHour]
