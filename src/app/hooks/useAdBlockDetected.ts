import { useState, useEffect } from 'react';

export default function useAdBlockDetected() {
  const [adBlockDetected, setAdBlockDetected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    // Ad blockers cancel network requests to known ad domains at the browser level,
    // causing fetch() to reject with a TypeError — unlike CORS errors, which resolve
    // with an opaque response in no-cors mode.
    fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal,
    })
      .then(() => setAdBlockDetected(false))
      .catch(() => setAdBlockDetected(true))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { adBlockDetected, loading };
}
