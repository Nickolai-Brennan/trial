import { formatDate } from '@/utils/cn'
import Badge from '@/components/ui/Badge'
import type { Post } from '@/types'
import { Clock, User, Eye, Tag as TagIcon } from 'lucide-react'

interface PostHeaderProps {
  post: Post
}

export default function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge label={post.category} variant="info" />
        {post.tags.map((tag) => (
          <Badge key={tag.id} label={`#${tag.name}`} />
        ))}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
        {post.title}
      </h1>

      <p className="text-lg text-gray-600 mb-6">{post.excerpt}</p>

      <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 border-t border-b border-gray-200 py-4">
        <div className="flex items-center gap-1.5">
          <User className="h-4 w-4" />
          <span>{post.author.username}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{formatDate(post.published_at)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          <span>{post.views.toLocaleString()} views</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TagIcon className="h-4 w-4" />
          <span>{post.category}</span>
        </div>
      </div>

      {post.cover_image && (
        <figure className="mt-6 overflow-hidden rounded-2xl">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full object-cover max-h-[480px]"
          />
        </figure>
      )}
    </header>
  )
}
