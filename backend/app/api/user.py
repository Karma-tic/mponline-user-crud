from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

# ====================== CRUD OPERATIONS ======================

# CREATE User
@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(request: Request, user: UserCreate, db: Session = Depends(get_db)):
    # Email check
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Phone check
    if db.query(User).filter(User.phone_number == user.phone_number).first():
        raise HTTPException(status_code=400, detail="Phone number already registered")
    
    new_user = User(
        first_name=user.first_name.strip(),
        last_name=user.last_name.strip(),
        email=user.email.lower().strip(),
        gender=user.gender,
        phone_number=user.phone_number.strip()
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


# READ All Users
@router.get("/", response_model=List[UserResponse])
def get_all_users(request: Request, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.is_active == True).all()
    return users


# READ Single User
@router.get("/{user_id}", response_model=UserResponse)
def get_user(request: Request, user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# UPDATE User
@router.put("/{user_id}", response_model=UserResponse)
def update_user(request: Request, user_id: int, updated_user: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Unique checks
    if user.email != updated_user.email:
        if db.query(User).filter(User.email == updated_user.email).first():
            raise HTTPException(status_code=400, detail="Email already in use")
    
    if user.phone_number != updated_user.phone_number:
        if db.query(User).filter(User.phone_number == updated_user.phone_number).first():
            raise HTTPException(status_code=400, detail="Phone number already in use")
    
    user.first_name = updated_user.first_name.strip()
    user.last_name = updated_user.last_name.strip()
    user.email = updated_user.email.lower().strip()
    user.gender = updated_user.gender
    user.phone_number = updated_user.phone_number.strip()
    
    db.commit()
    db.refresh(user)
    return user


# DELETE User
@router.delete("/{user_id}")
def delete_user(request: Request, user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully", "user_id": user_id}