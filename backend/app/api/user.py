from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

# Rate Limiter (Security)
limiter = Limiter(key_func=get_remote_address)

router = APIRouter(prefix="/users", tags=["Users"])

# CREATE User
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")   # Max 10 requests per minute from one IP
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    db_email = db.query(User).filter(User.email == user.email).first()
    if db_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Check if phone already exists
    db_phone = db.query(User).filter(User.phone_number == user.phone_number).first()
    if db_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    new_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        gender=user.gender,
        phone_number=user.phone_number
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# READ All Users
@router.get("/", response_model=List[UserResponse])
@limiter.limit("30/minute")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

# READ Single User
@router.get("/{user_id}", response_model=UserResponse)
@limiter.limit("30/minute")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# UPDATE User
@router.put("/{user_id}", response_model=UserResponse)
@limiter.limit("10/minute")
def update_user(user_id: int, updated_user: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check unique constraints
    if user.email != updated_user.email:
        if db.query(User).filter(User.email == updated_user.email).first():
            raise HTTPException(status_code=400, detail="Email already in use")
    
    if user.phone_number != updated_user.phone_number:
        if db.query(User).filter(User.phone_number == updated_user.phone_number).first():
            raise HTTPException(status_code=400, detail="Phone number already in use")
    
    user.first_name = updated_user.first_name
    user.last_name = updated_user.last_name
    user.email = updated_user.email
    user.gender = updated_user.gender
    user.phone_number = updated_user.phone_number
    
    db.commit()
    db.refresh(user)
    return user

# DELETE User
@router.delete("/{user_id}")
@limiter.limit("5/minute")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}