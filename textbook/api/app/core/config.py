from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Physical AI & Humanoid Robotics Textbook API"
    API_V1_STR: str = "/api/v1"

    # Database settings
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/textbook"

    # Qdrant settings - accepts full URL directly
    QDRANT_URL: str = "https://localhost:6333"
    QDRANT_API_KEY: str = ""

    # OpenAI settings (optional, fallback)
    OPENAI_API_KEY: str = ""

    # Google Gemini settings
    GOOGLE_API_KEY: str = ""

    # Auth settings
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 minutes
    SECRET_KEY: str = "a-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
