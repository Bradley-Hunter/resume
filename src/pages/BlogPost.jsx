import { useParams, Link, useSearchParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import posts, { allPosts } from '../data/blog'
import useDocTitle from '../hooks/useDocTitle'
import useMetaDescription from '../hooks/useMetaDescription'
import useOpenGraph from '../hooks/useOpenGraph'
import Giscus from '@giscus/react';

export default function BlogPost() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const preview = searchParams.get('preview') === 'true'
  const post = (preview ? allPosts : posts).find((p) => p.slug === slug)
  useDocTitle(post?.title ?? 'Post Not Found')
  useMetaDescription(post?.description)
  useOpenGraph({ title: post?.title, description: post?.description, url: `#/blog/${slug}`, type: 'article' })


  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Post not found</h1>
        <Link to="/blog" className="text-primary dark:text-primary-dark hover:underline">
          Back to Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/blog"
        className="text-sm text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors mb-6 inline-flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Posts
      </Link>

      {post.draft && (
        <div className="mt-6 mb-4 px-3 py-2 rounded-lg bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 text-xs font-medium">
          Draft — not publicly visible
        </div>
      )}
      <p className="text-sm text-gray-300 dark:text-gray-500 mt-6 mb-1">{post.date}</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-white dark:text-white mb-4">
        {post.title}
      </h1>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/blog?tag=${tag}`}
              className="px-2 py-0.5 rounded-full text-xs border border-gray-500 dark:border-gray-700 text-gray-300 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      <div className="prose">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-8 mb-3">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-8 mb-3 pb-2 border-b border-gray-600 dark:border-gray-700">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-semibold text-white mt-6 mb-2">{children}</h3>,
            p: ({ children }) => <p className="text-gray-200 dark:text-gray-300 leading-relaxed mb-4">{children}</p>,
            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-gray-200 dark:text-gray-300">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-200 dark:text-gray-300">{children}</ol>,
            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary dark:text-primary-dark hover:underline">{children}</a>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-primary dark:border-primary-dark pl-4 my-4 text-gray-300 dark:text-gray-400 italic">{children}</blockquote>,
            hr: () => <hr className="border-gray-600 dark:border-gray-700 my-8" />,
            strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
            img: ({ src, alt }) => (
              <figure className="my-6">
                <img src={src} alt={alt} className="w-full rounded-xl" />
                {alt && <figcaption className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">{alt}</figcaption>}
              </figure>
            ),
            code({ inline, className, children }) {
              const match = /language-(\w+)/.exec(className || '')
              if (!inline && match) {
                return (
                  <SyntaxHighlighter
                    language={match[1]}
                    style={oneDark}
                    customStyle={{ borderRadius: '0.5rem', fontSize: '0.8125rem', marginBottom: '1rem' }}
                    showLineNumbers
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                )
              }
              return (
                <code className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-200 text-sm font-mono">
                  {children}
                </code>
              )
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-600 dark:border-gray-800">
        <Link
          to="/blog"
          className="text-sm text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white transition-colors inline-flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Posts
        </Link>
      </div>

      <Giscus 
        repo="bradley-hunter/resume"
        repo-id="R_kgDOJDrhFg"
        category="Blog Posts"
        category-id="DIC_kwDOJDrhFs4C3_YR"
        mapping="specific"
        term={slug}
        strict="0"
        reactions-enabled="1"
        emit-metadata="0"
        input-position="top"
        theme="transparent_dark"
        lang="en"
      />

    </div>
  )
}
