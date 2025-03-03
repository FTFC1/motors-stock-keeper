
import { useState, useEffect } from 'react';

export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  useEffect(() => {
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
