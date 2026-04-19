from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, require_admin
from app.models.analytics import SiteAnalytics
from app.models.post import Post
from app.models.user import User
from app.schemas.analytics import DashboardStats, TopPost

router = APIRouter()


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_admin),
):
    total = await db.execute(select(func.count()).select_from(Post))
    published = await db.execute(
        select(func.count()).select_from(Post).where(Post.status == "published")
    )
    draft = await db.execute(
        select(func.count()).select_from(Post).where(Post.status == "draft")
    )
    total_views = await db.execute(select(func.coalesce(func.sum(Post.views), 0)))
    avg_bounce = await db.execute(
        select(func.coalesce(func.avg(SiteAnalytics.bounce_rate), 0.0))
    )
    total_visitors = await db.execute(
        select(func.coalesce(func.sum(SiteAnalytics.unique_visitors), 0))
    )
    top_posts_result = await db.execute(
        select(Post).where(Post.status == "published").order_by(Post.views.desc()).limit(10)
    )
    top_posts = [
        TopPost(id=p.id, title=p.title, slug=p.slug, views=p.views)
        for p in top_posts_result.scalars().all()
    ]

    return DashboardStats(
        total_posts=total.scalar_one(),
        published_posts=published.scalar_one(),
        draft_posts=draft.scalar_one(),
        total_views=int(total_views.scalar_one()),
        total_visitors=int(total_visitors.scalar_one()),
        avg_bounce_rate=float(avg_bounce.scalar_one()),
        top_posts=top_posts,
    )
