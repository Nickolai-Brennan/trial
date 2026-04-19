// ─── Shared domain types ──────────────────────────────────────────────────────

export type PostStatus = 'draft' | 'published' | 'archived'

export interface Author {
  id: number
  username: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  created_at: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface Post {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image?: string
  status: PostStatus
  category: string
  tags: Tag[]
  author: Author
  views: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PostCreate {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image?: string
  status: PostStatus
  category: string
  tag_ids: number[]
}

export interface PostUpdate extends Partial<PostCreate> {}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface PostAnalytics {
  post_id: number
  date: string
  views: number
  unique_visitors: number
  avg_time_on_page: number
}

export interface SiteAnalytics {
  date: string
  total_views: number
  unique_visitors: number
  bounce_rate: number
  top_pages: { path: string; views: number }[]
}

export interface DashboardStats {
  total_posts: number
  published_posts: number
  draft_posts: number
  total_views: number
  total_visitors: number
  avg_bounce_rate: number
  top_posts: Pick<Post, 'id' | 'title' | 'slug' | 'views'>[]
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  pages: number
}

// ─── API error ────────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string
}
