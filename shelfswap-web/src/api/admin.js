// หลังบ้าน: ทุก endpoint ต้องใช้ token ของ admin (Go ตรวจซ้ำทุกครั้ง ซ่อนเมนูฝั่ง React อย่างเดียวไม่พอ)
import { apiFetch, toQuery } from './client';

// ---------- คนที่ 1: ผู้ใช้ + หมวดหมู่ ----------
export const listUsers = (token, q) => apiFetch(`/api/admin/users${toQuery({ q })}`, { token });

export const setBanned = (token, userId, banned) =>
  apiFetch(`/api/admin/users/${userId}/ban`, { method: 'PUT', token, body: { banned } });

export const createCategory = (token, name, slug) =>
  apiFetch('/api/admin/categories', { method: 'POST', token, body: { name, slug } });

export const updateCategory = (token, id, name, slug) =>
  apiFetch(`/api/admin/categories/${id}`, { method: 'PUT', token, body: { name, slug } });

export const deleteCategory = (token, id) =>
  apiFetch(`/api/admin/categories/${id}`, { method: 'DELETE', token });

// ---------- คนที่ 2: ภาพรวม + อนุมัติประกาศ ----------
export const getStats = (token) => apiFetch('/api/admin/stats', { token });

export const adminListings = (token, status) =>
  apiFetch(`/api/admin/listings${toQuery({ status })}`, { token });

// action: 'approve' | 'reject' (reject ต้องมี reason)
export const reviewListing = (token, id, action, reason = '') =>
  apiFetch(`/api/admin/listings/${id}`, { method: 'PATCH', token, body: { action, reason } });
