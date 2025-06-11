from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_USER: str
    MONGO_PASSWORD: str
    MONGO_CLUSTER: str

    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASSWORD: str

    JWT_SECRET: str
    JWT_ALGORITHM: str

    class Config:
        env_file = ".env"

settings = Settings()
