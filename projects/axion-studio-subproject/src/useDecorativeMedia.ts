import { useEffect, useState } from 'react';

/**
 * Avoid requesting optional third-party decorative videos when a visitor
 * requests reduced motion. Retain the surrounding CSS background if a video
 * cannot load; this does not download, cache or relicense remote media.
 */
export function useDecorativeMedia() {
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [mediaFailed, setMediaFailed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return {
    showVideo: !reducedMotion && !mediaFailed,
    onVideoError: () => setMediaFailed(true),
    reducedMotion,
  };
}
