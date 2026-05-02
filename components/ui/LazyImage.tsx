import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  delayMs?: number;
}

export function LazyImage({ src, alt, className = "", delayMs = 0 }: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  // Use a second effect or just rely on state derived from props to reset
  useEffect(() => {
    let active = true;
    
    // Reset state before setting the timeout
    const resetTimer = setTimeout(() => {
      if (!active) return;
      setIsLoading(true);
      setCurrentSrc('');
      setRetryCount(0);
    }, 0);
    
    // Staggered loading to prevent rate-limiting when 10+ images render at once
    const timer = setTimeout(() => {
      if (active) setCurrentSrc(src);
    }, delayMs);
    
    return () => {
      active = false;
      clearTimeout(resetTimer);
      clearTimeout(timer);
    };
  }, [src, delayMs]);

  const handleError = () => {
    if (retryCount < 3) {
      // Retry in the background if Pollinations AI throws a 500 error or rate limit
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        // Append retry param to bust cache and force a new generation attempt
        setCurrentSrc(`${src}&retry=${retryCount + 1}&cacheBust=${Date.now()}`);
      }, 2000 + (retryCount * 1500));
    } else {
      setIsLoading(false); // Give up after 3 retries
    }
  };

  return (
    <div className={`relative w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-90 z-10 space-y-3">
           <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
           <span className="text-xs font-semibold text-indigo-600 uppercase tracking-widest animate-pulse px-4 text-center">
             {retryCount > 0 ? `Retrying (${retryCount}/3)...` : 'Synthesizing Image...'}
           </span>
        </div>
      )}

      {/* Actual Image */}
      {currentSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setIsLoading(false)}
          onError={handleError}
        />
      )}
      
      {/* Failed State */}
      {!isLoading && retryCount >= 3 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-xs font-semibold text-center p-4">
          Failed to generate. Please click &quot;Change Media&quot;
        </div>
      )}
    </div>
  );
}
