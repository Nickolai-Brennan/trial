import math
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, get_db
from app.models.post import Post, PostTag
from app.models.user import User
from app.schemas.post import PaginatedPosts, PostCreate, PostRead, PostUpdate

router = APIRouter()


async def _get_post_or_404(post_id: int, db: AsyncSession) -> Post:
    result = await db.execute(
        select(Post)
        .options(selectinload(Post.author), selectinload(Post.post_tags).selectinload(PostTag.tag))
        .where(Post.id == post_id)
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    return post


def _post_to_read(post: Post) -> PostRead:
    from app.schemas.post import AuthorRead, TagRead

    tags = [TagRead(id=pt.tag.id, name=pt.tag.name, slug=pt.tag.slug) for pt in post.post_tags]
    return PostRead(
        id=post.id,
        title=post.title,
        slug=post.slug,
        excerpt=post.excerpt,
        content=post.content,
        cover_image=post.cover_image,
        status=post.status,  # type: ignore[arg-type]
        category=post.category,
        views=post.views,
        author=AuthorRead.model_validate(post.author) if post.author else None,
        tags=tags,
        published_at=post.published_at,
        created_at=post.created_at,
        updated_at=post.updated_at,
    )


@router.get("", response_model=PaginatedPosts)
async def list_posts(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=100),
    category: str | None = None,
    q: str | None = None,
):
    query = (
        select(Post)
        .options(selectinload(Post.author), selectinload(Post.post_tags).selectinload(PostTag.tag))
        .where(Post.status == "published")
        .order_by(Post.published_at.desc())
    )
    if category:
        query = query.where(Post.category == category)
    if q:
        query = query.where(
            or_(Post.title.ilike(f"%{q}%"), Post.excerpt.ilike(f"%{q}%"))
        )

    total_result = await db.execute(select(func.count()).select_from(query.subquery()))
    total = total_result.scalar_one()

    result = await db.execute(query.offset((page - 1) * per_page).limit(per_page))
    posts = result.scalars().all()

    return PaginatedPosts(
        items=[_post_to_read(p) for p in posts],
        total=total,
        page=page,
        per_page=per_page,
        pages=max(1, math.ceil(total / per_page)),
    )


@router.get("/{post_id}", response_model=PostRead)
async def get_post(post_id: int, db: AsyncSession = Depends(get_db)):
    post = await _get_post_or_404(post_id, db)
    post.views += 1
    await db.commit()
    return _post_to_read(post)


@router.get("/{slug}/slug", response_model=PostRead)
async def get_post_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Post)
        .options(selectinload(Post.author), selectinload(Post.post_tags).selectinload(PostTag.tag))
        .where(Post.slug == slug, Post.status == "published")
    )
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    post.views += 1
    await db.commit()
    return _post_to_read(post)


@router.post("", response_model=PostRead, status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: PostCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = Post(
        title=payload.title,
        slug=payload.slug,
        excerpt=payload.excerpt,
        content=payload.content,
        cover_image=payload.cover_image,
        status=payload.status,
        category=payload.category,
        author_id=current_user.id,
        published_at=datetime.now(UTC) if payload.status == "published" else None,
    )
    db.add(post)
    await db.flush()

    for tag_id in payload.tag_ids:
        db.add(PostTag(post_id=post.id, tag_id=tag_id))

    await db.commit()
    return await _get_post_or_404(post.id, db)  # type: ignore[return-value]


@router.patch("/{post_id}", response_model=PostRead)
async def update_post(
    post_id: int,
    payload: PostUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = await _get_post_or_404(post_id, db)

    update_data = payload.model_dump(exclude_unset=True)
    tag_ids = update_data.pop("tag_ids", None)

    for field, value in update_data.items():
        setattr(post, field, value)

    if payload.status == "published" and not post.published_at:
        post.published_at = datetime.now(UTC)

    if tag_ids is not None:
        await db.execute(
            PostTag.__table__.delete().where(PostTag.post_id == post_id)  # type: ignore[attr-defined]
        )
        for tag_id in tag_ids:
            db.add(PostTag(post_id=post_id, tag_id=tag_id))

    await db.commit()
    return await _get_post_or_404(post_id, db)  # type: ignore[return-value]


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    post = await _get_post_or_404(post_id, db)
    await db.delete(post)
    await db.commit()
