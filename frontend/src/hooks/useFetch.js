import { useCallback, useEffect, useState } from 'react';

export default function useFetch(fetcher, auto = true, deps = []) {
  // default to undefined (not null) so callers that use destructuring
  // default values e.g. `const { data: items = [] } = useFetch(...)`
  // will correctly receive [] instead of null when the fetcher
  // hasn't returned yet. This reduces runtime errors like
  // "Cannot read properties of null (reading 'map')".
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher(...args);
      setData(res);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (auto && typeof fetcher === 'function') {
      // try to call with no args; callers who need params should call load manually
      try {
        load();
      } catch (e) {
        // swallow — load sets error state
      }
    }
  }, [auto, load]);

  return { data, loading, error, load, setData };
}
