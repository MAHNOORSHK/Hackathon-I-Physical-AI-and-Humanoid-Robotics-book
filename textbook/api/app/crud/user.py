from sqlalchemy.orm import Session
from api.app.models.user_db import User, UserProfile
from api.app.schemas.user import UserCreate, UserProfileCreate
from api.app.core.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_user_profile(db: Session, user_id: int, profile: UserProfileCreate):
    db_profile = UserProfile(**profile.dict(), owner_id=user_id)
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile
