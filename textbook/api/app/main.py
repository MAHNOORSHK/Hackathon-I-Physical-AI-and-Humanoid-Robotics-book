from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1 import chat, users, personalize, translate, reading
from app.services.ingestion_service import IngestionService
from app.core.config import settings
from app.db.session import Base, engine
from app.models.user_db import User, UserProfile, ReadingHistory # Import the new ORM models to register them with SQLAlchemy
import traceback

app = FastAPI(
    title="Physical AI & Humanoid Robotics Textbook API",
    description="API for the RAG chatbot and other features of the textbook.",
    version="0.1.0",
    debug=True,
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Error: {exc}")
    print(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

# CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Must be False when using "*" origins
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(users.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(personalize.router, prefix="/api/v1/personalize", tags=["personalization"])
app.include_router(translate.router, prefix="/api/v1/translate", tags=["translation"])
app.include_router(reading.router, prefix="/api/v1/reading", tags=["reading"])

def get_ingestion_service():
    return IngestionService(
        google_api_key=settings.GOOGLE_API_KEY,
        qdrant_url=settings.QDRANT_URL,
        qdrant_api_key=settings.QDRANT_API_KEY
    )

@app.post("/ingest", tags=["ingestion"])
async def ingest_content(ingestion_service: IngestionService = Depends(get_ingestion_service)):
    # This is a temporary solution for triggering ingestion.
    # In a real-world scenario, this would be a CLI command or a separate process.
    import os
    # Get the path relative to this file's location
    current_dir = os.path.dirname(os.path.abspath(__file__))
    book_path = os.path.join(current_dir, "..", "..", "..", "book")
    book_path = os.path.normpath(book_path)
    ingestion_service.ingest_book_content(book_path)
    return {"message": f"Content ingestion completed from {book_path}."}

@app.get("/")
async def root():
    return {"message": "Welcome to the Textbook API"}
