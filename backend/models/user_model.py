from pydantic import BaseModel, EmailStr

class RegisterUser(BaseModel):
    email: EmailStr
    full_name: str | None = None
    password: str | None = None
    phone_number: str | None = None
    
class LoginUser(BaseModel):
    email: EmailStr
    password: str