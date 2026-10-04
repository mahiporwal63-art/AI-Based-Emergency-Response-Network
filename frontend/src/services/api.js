const API = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export function getStoredAuth() {
  const stored = sessionStorage.getItem('emergency-response-auth');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    sessionStorage.removeItem('emergency-response-auth');
    return null;
  }
}

export function storeAuth(auth) {
  sessionStorage.setItem('emergency-response-auth', JSON.stringify(auth));
}

export function clearAuth() {
  sessionStorage.removeItem('emergency-response-auth');
}

async function request(path, options = {}) {
  let response;
  try {
    const auth = getStoredAuth();
    response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(auth?.access_token
          ? { Authorization: `Bearer ${auth.access_token}` }
          : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      'Cannot reach the backend. Make sure it is running on port 8000, then refresh the page.',
    );
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      typeof data?.detail === 'string'
        ? data.detail
        : 'Request failed. Please try again.',
    );
  }

  return data;
}

export const registerUser = (payload) =>
  request('/users/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const loginUser = (payload) =>
  request('/users/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const createIncident = (payload) =>
  request('/incidents', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getIncidents = () => request('/incidents');
export const getResources = () => request('/resources');
export const getIncident = (id) => request(`/incidents/${id}`);

export const updateIncidentStatus = (id, status) =>
  request(`/incidents/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
