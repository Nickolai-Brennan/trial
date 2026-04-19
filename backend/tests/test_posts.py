import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_list_posts_empty(client: AsyncClient):
    response = await client.get("/api/posts")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0
    assert data["page"] == 1


@pytest.mark.asyncio
async def test_get_post_not_found(client: AsyncClient):
    response = await client.get("/api/posts/9999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_get_post_by_slug_not_found(client: AsyncClient):
    response = await client.get("/api/posts/nonexistent-slug/slug")
    assert response.status_code == 404
