from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class TagRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: str


class AuthorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    role: str


PostStatus = Literal["draft", "published", "archived"]


class PostBase(BaseModel):
    title: str
    slug: str
    excerpt: str = ""
    content: str = ""
    cover_image: str | None = None
    status: PostStatus = "draft"
    category: str = ""


class PostCreate(PostBase):
    tag_ids: list[int] = []


class PostUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_image: str | None = None
    status: PostStatus | None = None
    category: str | None = None
    tag_ids: list[int] | None = None


class PostRead(PostBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    views: int
    author: AuthorRead | None
    tags: list[TagRead] = []
    published_at: datetime | None
    created_at: datetime
    updated_at: datetime


class PaginatedPosts(BaseModel):
    items: list[PostRead]
    total: int
    page: int
    per_page: int
    pages: int
