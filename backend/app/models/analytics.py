from sqlalchemy import JSON, Column, Date, Float, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.db.base import Base


class PostAnalytics(Base):
    __tablename__ = "post_analytics"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(Date, nullable=False)
    views = Column(Integer, nullable=False, default=0)
    unique_visitors = Column(Integer, nullable=False, default=0)
    avg_time_on_page = Column(Float, nullable=False, default=0.0)

    post = relationship("Post")


class SiteAnalytics(Base):
    __tablename__ = "site_analytics"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False, unique=True, index=True)
    total_views = Column(Integer, nullable=False, default=0)
    unique_visitors = Column(Integer, nullable=False, default=0)
    bounce_rate = Column(Float, nullable=False, default=0.0)
    top_pages = Column(JSON, nullable=False, default=list)
