from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/cms_db"
    secret_key: str = "change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    app_env: str = "development"
    debug: bool = True
    allowed_origins: list[str] = ["http://localhost:3000"]

    @field_validator("secret_key")
    @classmethod
    def secret_key_must_be_set(cls, v: str, info: object) -> str:
        _ = info  # suppress unused-variable warning
        if v == "change-me":
            import os

            if os.getenv("APP_ENV", "development") not in ("development", "test"):
                raise ValueError("SECRET_KEY must be set to a secure value in non-development environments")
        return v


settings = Settings()
