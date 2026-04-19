import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useArticle, useArticles } from '@/hooks/useArticles'
import PostHeader from '@/components/post/PostHeader'
import PostContent from '@/components/post/PostContent'
import ArticleCard from '@/components/feed/ArticleCard'
import Spinner from '@/components/ui/Spinner'

export default function Post() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = useArticle(slug ?? '')

  const { data: relatedData } = useArticles({
    category: post?.category,
    per_page: 3,
  })

  const relatedPosts = relatedData?.items.filter((p) => p.id !== post?.id).slice(0, 3) ?? []

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-lg font-semibold text-gray-700">Article not found.</p>
        <Link to="/" className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to feed
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* Article body */}
        <article className="min-w-0">
          <PostHeader post={post} />
          <PostContent content={post.content} />
        </article>

        {/* Sticky author + meta sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 flex flex-col gap-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">About the Author</h3>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                  {post.author.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{post.author.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{post.author.role}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedPosts.map((p) => (
              <ArticleCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
