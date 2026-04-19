import axios from 'axios'
import type {
  Post,
  PostCreate,
  PostUpdate,
  PaginatedResponse,
  PostAnalytics,
  SiteAnalytics,
  DashboardStats,
  Author,
} from '@/types'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('access_token')
    }
    return Promise.reject(err)
  }
)

// ─── Posts ────────────────────────────────────────────────────────────────────

export const postsApi = {
  list: (params?: { page?: number; per_page?: number; category?: string; q?: string }) =>
    client.get<PaginatedResponse<Post>>('/posts', { params }).then((r) => r.data),

  getBySlug: (slug: string) => client.get<Post>(`/posts/${slug}/slug`).then((r) => r.data),

  getById: (id: number) => client.get<Post>(`/posts/${id}`).then((r) => r.data),

  create: (data: PostCreate) => client.post<Post>('/posts', data).then((r) => r.data),

  update: (id: number, data: PostUpdate) =>
    client.patch<Post>(`/posts/${id}`, data).then((r) => r.data),

  remove: (id: number) => client.delete(`/posts/${id}`),
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export const analyticsApi = {
  postStats: (postId: number) =>
    client.get<PostAnalytics[]>(`/analytics/post/${postId}`).then((r) => r.data),

  site: (params?: { days?: number }) =>
    client.get<SiteAnalytics[]>('/analytics/site', { params }).then((r) => r.data),
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export const adminApi = {
  dashboard: () => client.get<DashboardStats>('/admin/dashboard').then((r) => r.data),
}

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  me: () => client.get<Author>('/users/me').then((r) => r.data),
}
