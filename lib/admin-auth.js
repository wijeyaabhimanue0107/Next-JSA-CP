import { apiRequest } from './api';

const USE_DEMO_ADMIN = process.env.NODE_ENV !== 'production';

async function demoRequest(options) {
  const response = await fetch('/api/demo-admin', {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.message || 'The request could not be completed.');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export function loginAdmin(username, password) {
  if (!USE_DEMO_ADMIN) {
    return apiRequest('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  return demoRequest({
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function getCurrentAdmin() {
  return USE_DEMO_ADMIN
    ? demoRequest({ method: 'GET' })
    : apiRequest('/api/admin/me');
}

export function logoutAdmin() {
  return USE_DEMO_ADMIN
    ? demoRequest({ method: 'DELETE' })
    : apiRequest('/api/admin/logout', { method: 'POST' });
}
