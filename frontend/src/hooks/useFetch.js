import { useCallback, useEffect, useState } from 'react';

export default function useFetch(fetcher, auto = true, deps = []) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const load = useCallback(
		async (...args) => {
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
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		deps
	);

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

