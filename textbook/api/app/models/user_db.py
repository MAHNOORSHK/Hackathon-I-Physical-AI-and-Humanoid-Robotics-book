from sqlalchemy import Column, Integer, String, DateTime, func, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    profile = relationship("UserProfile", back_populates="owner", uselist=False)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Background information
    software_background = Column(String, nullable=True) # e.g., "beginner", "intermediate", "expert"
    hardware_background = Column(String, nullable=True) # e.g., "beginner", "intermediate", "expert"
    
    owner = relationship("User", back_populates="profile")
