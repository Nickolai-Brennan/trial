from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.analytics import PostAnalytics, SiteAnalytics
from app.schemas.analytics import PostAnalyticsRead, SiteAnalyticsRead

router = APIRouter()


@router.get("/post/{post_id}", response_model=list[PostAnalyticsRead])
async def get_post_analytics(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365),
):
    from datetime import date, timedelta

    cutoff = date.today() - timedelta(days=days)
    result = await db.execute(
        select(PostAnalytics)
        .where(PostAnalytics.post_id == post_id, PostAnalytics.date >= cutoff)
        .order_by(PostAnalytics.date)
    )
    return result.scalars().all()


@router.get("/site", response_model=list[SiteAnalyticsRead])
async def get_site_analytics(
    db: AsyncSession = Depends(get_db),
    days: int = Query(30, ge=1, le=365),
):
    from datetime import date, timedelta

    cutoff = date.today() - timedelta(days=days)
    result = await db.execute(
        select(SiteAnalytics)
        .where(SiteAnalytics.date >= cutoff)
        .order_by(SiteAnalytics.date)
    )
    return result.scalars().all()
