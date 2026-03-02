import { useEffect } from 'react'

const BASE = 'Bradley Hunter'

export default function useDocTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE}` : BASE
    return () => { document.title = BASE }
  }, [title])
}
