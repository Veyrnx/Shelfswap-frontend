import { apiFetch, toQuery } from './client';

// ---------- คนที่ 1: หน้าร้าน (Guest เรียกได้) ----------

// filters = { q, category, condition, minPrice, maxPrice, sort, page, pageSize }
// ได้ { items, total, page, pageSize, totalPages }
export const searchListings = (filters) => apiFetch(`/api/listings${toQuery(filters)}`);

// ส่ง token ด้วยถ้ามี เจ้าของจะเห็นประกาศที่ยังรออนุมัติของตัวเองได้
export const getListing = (id, token) => apiFetch(`/api/listings/${id}`, { token });

export const getCategories = () => apiFetch('/api/categories');

// ---------- คนที่ 2: จัดการประกาศของฉัน ----------

// input = { title, description, price, condition, imageUrl, categoryId }
export const createListing = (token, input) =>
  apiFetch('/api/listings', { method: 'POST', token, body: input });

export const updateListing = (token, id, input) =>
  apiFetch(`/api/listings/${id}`, { method: 'PUT', token, body: input });

export const deleteListing = (token, id) =>
  apiFetch(`/api/listings/${id}`, { method: 'DELETE', token });

export const markSold = (token, id) =>
  apiFetch(`/api/listings/${id}/sold`, { method: 'POST', token });

export const myListings = (token) => apiFetch('/api/me/listings', { token });
