import { useQuery } from '@tanstack/react-query'
import { analyticsApi, adminApi } from '@/services/api'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.dashboard(),
  })
}

export function useSiteAnalytics(days = 30) {
  return useQuery({
    queryKey: ['analytics', 'site', days],
    queryFn: () => analyticsApi.site({ days }),
  })
}

export function usePostAnalytics(postId: number) {
  return useQuery({
    queryKey: ['analytics', 'post', postId],
    queryFn: () => analyticsApi.postStats(postId),
    enabled: Boolean(postId),
  })
}
