import { Link } from 'react-router-dom'

export default function BlogCard({ post, featured }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group block rounded-xl border transition-all duration-200 hover:shadow-lg ${
        featured
          ? 'p-8 border-primary/50 dark:border-primary-dark/40 bg-gray-600 dark:bg-gray-900 hover:border-primary dark:hover:border-primary-dark ring-1 ring-primary/15 dark:ring-primary-dark/10'
          : 'p-6 border-gray-600 dark:border-gray-800 bg-gray-600 dark:bg-gray-900 hover:border-primary dark:hover:border-primary-dark'
      }`}
    >
      {featured && (
        <span className="inline-block text-xs font-semibold uppercase tracking-wider text-primary dark:text-primary-dark mb-2">
          Featured
        </span>
      )}
      <p className="text-xs text-gray-300 dark:text-gray-500 mb-2">{post.date}</p>
      <h3 className={`font-semibold text-white dark:text-white group-hover:text-primary dark:group-hover:text-primary-dark transition-colors mb-2 ${
        featured ? 'text-xl' : 'text-lg'
      }`}>
        {post.title}
      </h3>
      <p className="text-sm text-gray-200 dark:text-gray-400 leading-relaxed line-clamp-3 mb-4">
        {post.description}
      </p>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs border border-gray-500 dark:border-gray-700 text-gray-300 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
