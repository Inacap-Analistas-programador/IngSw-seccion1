const BASE = import.meta.env.VITE_API_BASE || '';

async function request(path, options = {}) {
	const url = `${BASE}${path}`;
	const token = typeof window !== 'undefined' ? localStorage.getItem('idToken') : null;
	const headers = {
		'Content-Type': 'application/json',
		...(options.headers || {}),
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};

	const res = await fetch(url, { ...options, headers });
	if (!res.ok) {
		let text = await res.text();
		try {
			const json = JSON.parse(text);
			text = json.message || JSON.stringify(json);
		} catch (_) {}
		const err = new Error(text || res.statusText || 'Request failed');
		err.status = res.status;
		throw err;
	}

	const ct = res.headers.get('content-type') || '';
	if (ct.includes('application/json')) return res.json();
	return res.text();
}

// Payments endpoints
export const getPayments = async (query = '') => {
	const qs = query ? `?${query}` : '';
	return request(`/api/pagos${qs}`, { method: 'GET' });
};

export const getPaymentById = async (id) => request(`/api/pagos/${id}`, { method: 'GET' });

export const createPayment = async (payload) =>
	request('/api/pagos', { method: 'POST', body: JSON.stringify(payload) });

export const updatePayment = async (id, payload) =>
	request(`/api/pagos/${id}`, { method: 'PUT', body: JSON.stringify(payload) });

export const deletePayment = async (id) => request(`/api/pagos/${id}`, { method: 'DELETE' });

export default { getPayments, getPaymentById, createPayment, updatePayment, deletePayment };
