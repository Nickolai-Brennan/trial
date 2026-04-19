import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { useArticles } from '@/hooks/useArticles'
import ArticleCard from '@/components/feed/ArticleCard'
import SocialFeedPanel from '@/components/feed/SocialFeedPanel'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'

const CATEGORIES = ['All', 'Technology', 'Business', 'Culture', 'Science', 'Sports']

export default function NewsFeed() {
  const [category, setCategory] = useState<string | undefined>(undefined)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useArticles({ page, per_page: 9, category, q: query || undefined })

  const handleCategoryChange = (cat: string) => {
    setCategory(cat === 'All' ? undefined : cat)
    setPage(1)
  }

  const [featured, ...rest] = data?.items ?? []

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6">
      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                (cat === 'All' && !category) || cat === category
                  ? 'border-brand-600 bg-brand-600 text-white'
                  : 'border-gray-300 bg-white text-gray-600 hover:border-brand-400 hover:text-brand-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Content column */}
        <section>
          {isLoading && (
            <div className="flex justify-center py-20">
              <Spinner size="lg" />
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
              Failed to load articles. Please try again.
            </div>
          )}

          {!isLoading && !isError && data?.items.length === 0 && (
            <div className="py-20 text-center text-gray-500">No articles found.</div>
          )}

          {featured && (
            <div className="mb-6">
              <ArticleCard post={featured} featured />
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
              {rest.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.pages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-500">
                Page {page} of {data.pages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
              >
                Next
              </Button>
            </div>
          )}
        </section>

        {/* Social sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-20">
            <SocialFeedPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
