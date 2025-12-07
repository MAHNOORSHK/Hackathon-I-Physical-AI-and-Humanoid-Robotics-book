from fastapi import FastAPI, Depends
from app.api.v1 import chat, users, personalize, translate
from app.services.ingestion_service import IngestionService
from app.core.config import settings
from app.db.session import Base, engine
from app.models.user_db import User, UserProfile # Import the new ORM models to register them with SQLAlchemy

app = FastAPI(
    title="Physical AI & Humanoid Robotics Textbook API",
    description="API for the RAG chatbot and other features of the textbook.",
    version="0.1.0",
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
app.include_router(users.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(personalize.router, prefix="/api/v1/personalize", tags=["personalization"])
app.include_router(translate.router, prefix="/api/v1/translate", tags=["translation"])

def get_ingestion_service():
    return IngestionService(
        openai_api_key=settings.OPENAI_API_KEY,
        qdrant_host=settings.QDRANT_HOST,
        qdrant_api_key=settings.QDRANT_API_KEY
    )

@app.post("/ingest", tags=["ingestion"])
async def ingest_content(ingestion_service: IngestionService = Depends(get_ingestion_service)):
    # This is a temporary solution for triggering ingestion.
    # In a real-world scenario, this would be a CLI command or a separate process.
    # The path is relative to the root of the project.
    book_path = "textbook/book" 
    ingestion_service.ingest_book_content(book_path)
    return {"message": "Content ingestion started."}

@app.get("/")
async def root():
    return {"message": "Welcome to the Textbook API"}
