from app.db.session import engine, Base
from app.models.chat_db import ChatHistory # Import to ensure model is registered with Base
from app.models.user_db import User, UserProfile # Import new user models

def create_db_tables():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")

if __name__ == "__main__":
    create_db_tables()
