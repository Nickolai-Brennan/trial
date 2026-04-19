import datetime

from pydantic import BaseModel, ConfigDict


class PostAnalyticsRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    post_id: int
    date: datetime.date
    views: int
    unique_visitors: int
    avg_time_on_page: float


class TopPage(BaseModel):
    path: str
    views: int


class SiteAnalyticsRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    date: datetime.date
    total_views: int
    unique_visitors: int
    bounce_rate: float
    top_pages: list[TopPage] = []


class TopPost(BaseModel):
    id: int
    title: str
    slug: str
    views: int


class DashboardStats(BaseModel):
    total_posts: int
    published_posts: int
    draft_posts: int
    total_views: int
    total_visitors: int
    avg_bounce_rate: float
    top_posts: list[TopPost]
