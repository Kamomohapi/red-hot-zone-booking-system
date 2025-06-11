from pydantic import BaseModel

class Booking(BaseModel):
    client_name: str
    client_email: str
    client_phone: str
    date: str
    time_slot: str
    service_type: str
    isConfirmed: bool = False  
    salon_slug: str

