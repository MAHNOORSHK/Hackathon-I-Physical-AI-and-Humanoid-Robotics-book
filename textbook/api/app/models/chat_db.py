from sqlalchemy import Column, Integer, String, DateTime, func
from app.db.session import Base

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_query = Column(String, index=True, nullable=False)
    chatbot_response = Column(String, nullable=False)
    timestamp = Column(DateTime, default=func.now())
