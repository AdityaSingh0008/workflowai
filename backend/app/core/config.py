from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "sqlite:///./workflowai.db"
    llm_provider: str = "openai"
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    approval_required_actions: str = "salary_change,expense_approval,access_grant,termination,payment_release"

    class Config:
        env_file = ".env"

    @property
    def approval_required_set(self) -> set[str]:
        return {a.strip() for a in self.approval_required_actions.split(",") if a.strip()}


@lru_cache
def get_settings() -> Settings:
    return Settings()
