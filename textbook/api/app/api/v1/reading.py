from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.user_db import User, ReadingHistory

router = APIRouter()


class ReadingActivityCreate(BaseModel):
    page_path: str
    page_title: str | None = None
    time_spent_seconds: int = 0


class ReadingActivityResponse(BaseModel):
    id: int
    page_path: str
    page_title: str | None
    started_at: datetime
    last_accessed: datetime
    time_spent_seconds: int

    class Config:
        from_attributes = True


class ReadingHistoryResponse(BaseModel):
    total_pages_read: int
    total_time_spent_seconds: int
    history: List[ReadingActivityResponse]


@router.post("/track", response_model=ReadingActivityResponse)
async def track_reading(
    activity: ReadingActivityCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)]
):
    """Track or update reading activity for a page"""
    # Check if there's already a reading record for this page by this user
    existing_record = db.query(ReadingHistory).filter(
        ReadingHistory.user_id == current_user.id,
        ReadingHistory.page_path == activity.page_path
    ).first()

    if existing_record:
        # Update existing record
        existing_record.time_spent_seconds += activity.time_spent_seconds
        existing_record.last_accessed = datetime.utcnow()
        if activity.page_title:
            existing_record.page_title = activity.page_title
        db.commit()
        db.refresh(existing_record)
        return existing_record
    else:
        # Create new record
        new_record = ReadingHistory(
            user_id=current_user.id,
            page_path=activity.page_path,
            page_title=activity.page_title,
            time_spent_seconds=activity.time_spent_seconds
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record


@router.get("/history", response_model=ReadingHistoryResponse)
async def get_reading_history(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)]
):
    """Get reading history for the current user"""
    history = db.query(ReadingHistory).filter(
        ReadingHistory.user_id == current_user.id
    ).order_by(ReadingHistory.last_accessed.desc()).all()

    total_time = sum(record.time_spent_seconds for record in history)

    return ReadingHistoryResponse(
        total_pages_read=len(history),
        total_time_spent_seconds=total_time,
        history=history
    )


@router.get("/recent", response_model=List[ReadingActivityResponse])
async def get_recent_reading(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    limit: int = 5
):
    """Get recently read pages"""
    history = db.query(ReadingHistory).filter(
        ReadingHistory.user_id == current_user.id
    ).order_by(ReadingHistory.last_accessed.desc()).limit(limit).all()

    return history
