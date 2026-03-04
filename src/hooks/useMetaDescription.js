import { useEffect } from 'react'

const DEFAULT = 'Bradley Hunter — Software Engineering student specializing in systems programming and desktop development.'

export default function useMetaDescription(description) {
  useEffect(() => {
    let tag = document.querySelector('meta[name="description"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'description')
      document.head.appendChild(tag)
    }
    const prev = tag.getAttribute('content')
    tag.setAttribute('content', description ?? DEFAULT)
    return () => { tag.setAttribute('content', prev ?? DEFAULT) }
  }, [description])
}
