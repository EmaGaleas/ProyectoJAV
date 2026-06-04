import { useState, useEffect } from 'react'

// tablet horizontal: <= 900px
export function useIsTablet() {
  const [isTablet, setIsTablet] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 900 : false,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    setIsTablet(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsTablet(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isTablet
}
