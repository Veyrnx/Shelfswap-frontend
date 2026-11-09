// คนที่ 1: สมาชิก
import { apiFetch } from './client';

// ได้ { token, user } ทั้งสองตัว (สมัครเสร็จล็อกอินให้เลย)
export const register = (email, password, displayName) =>
  apiFetch('/api/auth/register', { method: 'POST', body: { email, password, displayName } });

export const login = (email, password) =>
  apiFetch('/api/auth/login', { method: 'POST', body: { email, password } });

export const logout = (token) => apiFetch('/api/auth/logout', { method: 'POST', token });

export const getMe = (token) => apiFetch('/api/me', { token });

export const updateMe = (token, { displayName, phone }) =>
  apiFetch('/api/me', { method: 'PUT', token, body: { displayName, phone } });

export const changePassword = (token, currentPassword, newPassword) =>
  apiFetch('/api/me/password', { method: 'PUT', token, body: { currentPassword, newPassword } });
