from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Physical AI & Humanoid Robotics Textbook API"
    API_V1_STR: str = "/api/v1"

    # Database settings
    DATABASE_URL: str
    QDRANT_HOST: str
    QDRANT_API_KEY: str

    # OpenAI settings
    OPENAI_API_KEY: str

    # Auth settings
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 # 30 minutes
    SECRET_KEY: str = "a-super-secret-key"
    ALGORITHM: str = "HS256"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
