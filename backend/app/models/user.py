from sqlalchemy import Column, Integer, String, Enum as SQLEnum, DateTime, Boolean
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class Gender(str, enum.Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    gender = Column(SQLEnum(Gender), nullable=False)
    phone_number = Column(String(15), unique=True, nullable=False)
    
    is_active = Column(Boolean, default=True)           # ← Yeh change kiya
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())