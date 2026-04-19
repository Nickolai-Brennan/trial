from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    __allow_unmapped__ = True


# Import all models here so Alembic can detect them
from app.models import analytics, post, user  # noqa: F401, E402
