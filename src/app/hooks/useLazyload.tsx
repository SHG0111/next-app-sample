// /app/hooks/useLazyload.ts
import { useEffect, useRef, useState } from "react";

export function useLazyLoad(callback: () => void, options = {}) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const target = observerTarget.current;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setIsLoading(true);
          try {
            await callback();
          } catch (error) {
            console.error("Error loading more products:", error);
          } finally {
            setIsLoading(false);
          }
        }
      },
      {
        threshold: 0.1,
        ...options,
      },
    );

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
    };
  }, [callback, isLoading, options]);

  return { observerTarget, isLoading };
}
