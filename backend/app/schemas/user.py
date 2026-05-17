from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime
import re

class UserBase(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    gender: str
    phone_number: str = Field(..., min_length=10, max_length=15)

    class Config:
        from_attributes = True

class UserCreate(UserBase):
    @field_validator('phone_number')
    def validate_phone(cls, v):
        if not re.match(r'^\+?[0-9]{10,15}$', v):
            raise ValueError('Phone number should be 10-15 digits only')
        return v

    @field_validator('gender')
    def validate_gender(cls, v):
        allowed = ["Male", "Female", "Other"]
        if v not in allowed:
            raise ValueError(f'Gender must be one of: {allowed}')
        return v

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: Optional[datetime] = None   # ← Yeh change kiya
    updated_at: Optional[datetime] = None