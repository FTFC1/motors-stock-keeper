
import { useState, useEffect } from 'react';

export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkViewport = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    
    // Initial check
    checkViewport();
    
    // Add event listener
    window.addEventListener('resize', checkViewport);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkViewport);
    };
  }, [breakpoint]);
  
  return isMobile;
}
