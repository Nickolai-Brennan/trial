from datetime import UTC, datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.db.base import Base


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), nullable=False, unique=True)
    slug = Column(String(80), nullable=False, unique=True)

    posts: list["Post"] = relationship("PostTag", back_populates="tag")


class PostTag(Base):
    __tablename__ = "post_tags"

    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)

    post: "Post" = relationship("Post", back_populates="post_tags")
    tag: Tag = relationship("Tag", back_populates="posts")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(280), nullable=False, unique=True, index=True)
    excerpt = Column(Text, nullable=False, default="")
    content = Column(Text, nullable=False, default="")
    cover_image = Column(String(512), nullable=True)
    status = Column(String(20), nullable=False, default="draft")
    category = Column(String(100), nullable=False, default="")
    views = Column(Integer, nullable=False, default=0)
    author_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    published_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    author = relationship("User", back_populates="posts")
    post_tags: list[PostTag] = relationship(
        "PostTag", back_populates="post", cascade="all, delete-orphan"
    )
