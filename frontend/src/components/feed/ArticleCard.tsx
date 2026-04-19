import { Link } from 'react-router-dom'
import { Clock, Eye } from 'lucide-react'
import { formatDate, formatNumber } from '@/utils/cn'
import Badge from '@/components/ui/Badge'
import type { Post } from '@/types'

interface ArticleCardProps {
  post: Post
  featured?: boolean
}

export default function ArticleCard({ post, featured = false }: ArticleCardProps) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md ${featured ? 'md:flex-row' : ''}`}
    >
      {post.cover_image && (
        <Link
          to={`/post/${post.slug}`}
          className={`block overflow-hidden bg-gray-100 ${featured ? 'md:w-2/5 shrink-0' : 'aspect-video w-full'}`}
        >
          <img
            src={post.cover_image}
            alt={post.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge label={post.category} variant="info" />
          {post.tags.slice(0, 2).map((tag) => (
            <Badge key={tag.id} label={tag.name} />
          ))}
        </div>

        <Link to={`/post/${post.slug}`} className="group/title">
          <h2
            className={`font-bold leading-snug text-gray-900 group-hover/title:text-brand-700 transition-colors ${featured ? 'text-xl' : 'text-base'}`}
          >
            {post.title}
          </h2>
        </Link>

        {featured && (
          <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
        )}

        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDate(post.published_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{formatNumber(post.views)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
