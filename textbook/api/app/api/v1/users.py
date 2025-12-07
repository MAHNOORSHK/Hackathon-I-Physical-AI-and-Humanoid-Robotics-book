from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import create_access_token, verify_password, get_password_hash, get_current_user # Changed get_current_user_email to get_current_user
from app.schemas.user import UserCreate, UserLogin, Token, UserProfileResponse as UserProfile, UserProfileCreate, UserResponse # Added UserResponse
from app.core.config import settings
from app.db.session import get_db
from app.models.user_db import User, UserProfile # Import the new ORM User and UserProfile models

router = APIRouter()

@router.post("/register", response_model=Token)
async def register_user(user_data: UserCreate, db: Annotated[Session, Depends(get_db)]):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user_data.password)
    
    # Create new User ORM object
    db_user = User(
        email=user_data.email,
        hashed_password=hashed_password,
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user) # Refresh to get the generated user ID

    # Create UserProfile
    db_profile = UserProfile(
        owner_id=db_user.id,
        software_background=user_data.software_background,
        hardware_background=user_data.hardware_background
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Annotated[Session, Depends(get_db)]):
    db_user = db.query(User).filter(User.email == form_data.username).first()
    
    if not db_user or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    # current_user now contains the ORM User object with its profile loaded
    if not current_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Construct UserResponse from ORM User and its associated Profile
    user_profile_response = None
    if current_user.profile:
        user_profile_response = UserProfile(
            id=current_user.profile.id,
            owner_id=current_user.profile.owner_id,
            software_background=current_user.profile.software_background,
            hardware_background=current_user.profile.hardware_background
        )

    user_response = UserResponse(
        id=current_user.id,
        email=current_user.email,
        is_active=current_user.is_active,
        profile=user_profile_response
    )
    return user_response