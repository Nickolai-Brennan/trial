import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import type { DashboardStats } from '@/types'

interface TrafficTableProps {
  posts: DashboardStats['top_posts']
}

export default function TrafficTable({ posts }: TrafficTableProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700">Top Content by Views</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {posts.map((post, idx) => (
          <div key={post.id} className="flex items-center gap-4 px-5 py-3">
            <span className="text-xs font-semibold text-gray-400 w-5">{idx + 1}</span>
            <Link
              to={`/post/${post.slug}`}
              className="flex-1 text-sm font-medium text-gray-800 hover:text-brand-700 truncate"
            >
              {post.title}
            </Link>
            <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
              <Eye className="h-3.5 w-3.5" />
              <span>{post.views.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
