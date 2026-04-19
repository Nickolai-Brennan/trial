import { FileText, Eye, Users, TrendingDown, BarChart2, Globe, Search } from 'lucide-react'
import StatsCard from '@/components/dashboard/StatsCard'
import AnalyticsChart from '@/components/dashboard/AnalyticsChart'
import TrafficTable from '@/components/dashboard/TrafficTable'
import Spinner from '@/components/ui/Spinner'
import { useDashboardStats, useSiteAnalytics } from '@/hooks/useAnalytics'

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: siteData, isLoading: siteLoading } = useSiteAnalytics(30)

  if (statsLoading || siteLoading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Analytics, traffic, SEO and content performance
        </p>
      </div>

      {/* Stats grid */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard
            title="Total Posts"
            value={stats.total_posts}
            icon={FileText}
            subtitle={`${stats.published_posts} published`}
            className="col-span-1"
          />
          <StatsCard
            title="Total Views"
            value={stats.total_views.toLocaleString()}
            icon={Eye}
            trend={{ value: 12, positive: true }}
          />
          <StatsCard
            title="Unique Visitors"
            value={stats.total_visitors.toLocaleString()}
            icon={Users}
            trend={{ value: 8, positive: true }}
          />
          <StatsCard
            title="Bounce Rate"
            value={`${stats.avg_bounce_rate.toFixed(1)}%`}
            icon={TrendingDown}
            trend={{ value: 3, positive: false }}
          />
          <StatsCard
            title="Drafts"
            value={stats.draft_posts}
            icon={BarChart2}
            subtitle="pending review"
          />
          <StatsCard
            title="Avg. Daily"
            value={Math.round(stats.total_views / 30).toLocaleString()}
            icon={Globe}
            subtitle="views per day"
          />
        </div>
      )}

      {/* Two-column chart + table layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mb-8">
        {siteData && siteData.length > 0 ? (
          <AnalyticsChart data={siteData} />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-5 flex items-center justify-center text-sm text-gray-400">
            No analytics data available
          </div>
        )}

        {stats && stats.top_posts.length > 0 && (
          <TrafficTable posts={stats.top_posts} />
        )}
      </div>

      {/* SEO & admin summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-gray-700">SEO Overview</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Indexed pages</span>
              <span className="font-semibold text-gray-900">{stats?.published_posts ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg. session duration</span>
              <span className="font-semibold text-gray-900">3m 42s</span>
            </div>
            <div className="flex justify-between">
              <span>Organic traffic share</span>
              <span className="font-semibold text-gray-900">62%</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-gray-700">Traffic Sources</h3>
          </div>
          {[
            { source: 'Organic Search', pct: 62 },
            { source: 'Direct', pct: 20 },
            { source: 'Social', pct: 12 },
            { source: 'Referral', pct: 6 },
          ].map(({ source, pct }) => (
            <div key={source} className="mb-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>{source}</span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="h-4 w-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-gray-700">Content Health</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Published</span>
              <span className="font-semibold text-green-700">{stats?.published_posts ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>Drafts</span>
              <span className="font-semibold text-yellow-700">{stats?.draft_posts ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>Total</span>
              <span className="font-semibold text-gray-900">{stats?.total_posts ?? '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
