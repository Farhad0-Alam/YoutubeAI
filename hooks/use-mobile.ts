import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    mql.addEventListener("change", onChange)
    
    // Set initial without setting synchronous in effect body
    const initialIsMobile = window.innerWidth < MOBILE_BREAKPOINT
    const timer = setTimeout(() => {
      setIsMobile(initialIsMobile);
    }, 0);
    
    return () => {
      clearTimeout(timer);
      mql.removeEventListener("change", onChange);
    }
  }, [])

  return isMobile
}
