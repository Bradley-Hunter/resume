import { useEffect } from 'react'

const SITE_URL = 'https://bradley-hunter.github.io/resume'
const DEFAULT_DESCRIPTION =
  'Software engineering student specializing in systems programming and desktop development with Rust, C++, and Python.'
const OG_IMAGE = `${SITE_URL}/og-image.png`

// Creates or updates a <meta> tag and returns a cleanup function that restores the previous value.
function upsertMeta(attrName, attrValue, content) {
  let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attrName, attrValue)
    document.head.appendChild(tag)
  }
  const prev = tag.getAttribute('content')
  tag.setAttribute('content', content)
  return () => {
    if (prev !== null) tag.setAttribute('content', prev)
    else tag.remove()
  }
}

/**
 * Sets Open Graph and Twitter Card meta tags for the current page.
 *
 * @param {object} options
 * @param {string} [options.title]        - Page title (appended with "| Bradley Hunter")
 * @param {string} [options.description]  - Page description
 * @param {string} [options.url]          - Hash-relative URL, e.g. "#/blog/my-post"
 * @param {string} [options.type]         - OG type: "website" (default) or "article"
 */
export default function useOpenGraph({ title, description, url, type = 'website' } = {}) {
  useEffect(() => {
    const resolvedTitle = title ? `${title} | Bradley Hunter` : 'Bradley Hunter — Portfolio'
    const resolvedDesc = description ?? DEFAULT_DESCRIPTION
    const resolvedUrl = url ? `${SITE_URL}/${url}` : SITE_URL

    const cleanups = [
      upsertMeta('property', 'og:title', resolvedTitle),
      upsertMeta('property', 'og:description', resolvedDesc),
      upsertMeta('property', 'og:url', resolvedUrl),
      upsertMeta('property', 'og:type', type),
      upsertMeta('property', 'og:image', OG_IMAGE),
      upsertMeta('name', 'twitter:title', resolvedTitle),
      upsertMeta('name', 'twitter:description', resolvedDesc),
      upsertMeta('name', 'twitter:image', OG_IMAGE),
      upsertMeta('name', 'twitter:card', 'summary_large_image'),
    ]

    return () => cleanups.forEach((fn) => fn())
  }, [title, description, url, type])
}
