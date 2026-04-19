import { useQuery } from '@tanstack/react-query'
import { postsApi } from '@/services/api'

interface UseArticlesParams {
  page?: number
  per_page?: number
  category?: string
  q?: string
}

export function useArticles(params: UseArticlesParams = {}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => postsApi.list(params),
  })
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => postsApi.getBySlug(slug),
    enabled: Boolean(slug),
  })
}
