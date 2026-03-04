import { useSearchParams } from 'react-router-dom'
import posts, { allPosts } from '../data/blog'
import BlogCard from '../components/BlogCard'
import useDocTitle from '../hooks/useDocTitle'
import useMetaDescription from '../hooks/useMetaDescription'

export default function BlogHub() {
  useDocTitle('Blog')
  useMetaDescription('Thoughts on software engineering, projects, and things I\'ve learned along the way.')

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTag = searchParams.get('tag') || ''
  const preview = searchParams.get('preview') === 'true'

  const pool = preview ? allPosts : posts
  const allTags = [...new Set(pool.flatMap((p) => p.tags))].sort()
  const tagCounts = Object.fromEntries(allTags.map((tag) => [tag, pool.filter((p) => p.tags.includes(tag)).length]))
  const featured = !activeTag ? pool.filter((p) => p.featured).slice(0, 2) : []
  const featuredSlugs = new Set(featured.map((p) => p.slug))
  const filtered = (activeTag ? pool.filter((p) => p.tags.includes(activeTag)) : pool).filter((p) => !featuredSlugs.has(p.slug))

  function toggleTag(tag) {
    setSearchParams(tag === activeTag ? {} : { tag })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white dark:text-white mb-2">Blog</h1>
      <p className="text-gray-300 dark:text-gray-400 mb-6">
        Thoughts on software engineering, projects, and things I've learned along the way.
      </p>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeTag === tag
                  ? 'bg-primary dark:bg-primary-dark text-gray-900 border-primary dark:border-primary-dark'
                  : 'bg-transparent text-gray-300 dark:text-gray-400 border-gray-600 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
            >
              {tag} ({tagCounts[tag]})
            </button>
          ))}
        </div>
      )}

      {featured.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-300 dark:text-gray-500 mb-4">
            Featured
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featured.map((post) => (
              <BlogCard key={post.slug} post={post} featured />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && !activeTag ? null : filtered.length === 0 ? (
        <p className="text-gray-300 dark:text-gray-400">No posts tagged &ldquo;{activeTag}&rdquo; yet.</p>
      ) : (
        <div>
          {featured.length > 0 && (
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-300 dark:text-gray-500 mb-4">
              All Posts
            </h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filtered.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
