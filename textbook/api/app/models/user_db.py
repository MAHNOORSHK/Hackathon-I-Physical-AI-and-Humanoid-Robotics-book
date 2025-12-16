from sqlalchemy import Column, Integer, String, DateTime, func, Boolean, Text
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
    reading_history = relationship("ReadingHistory", back_populates="user")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    
    # Background information
    software_background = Column(String, nullable=True) # e.g., "beginner", "intermediate", "expert"
    hardware_background = Column(String, nullable=True) # e.g., "beginner", "intermediate", "expert"
    
    owner = relationship("User", back_populates="profile")


class ReadingHistory(Base):
    __tablename__ = "reading_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    page_path = Column(String, nullable=False)  # e.g., "/docs/intro" or "/docs/modules/module-1-ros2"
    page_title = Column(String, nullable=True)  # e.g., "Introduction to ROS2"
    started_at = Column(DateTime, default=func.now())  # When user opened the page
    last_accessed = Column(DateTime, default=func.now(), onupdate=func.now())  # Last time user was on page
    time_spent_seconds = Column(Integer, default=0)  # Total time spent on page

    user = relationship("User", back_populates="reading_history")
