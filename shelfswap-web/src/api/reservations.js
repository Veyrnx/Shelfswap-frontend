// คนที่ 2: การจอง
import { apiFetch } from './client';

export const reserve = (token, listingId, message) =>
  apiFetch(`/api/listings/${listingId}/reserve`, { method: 'POST', token, body: { message } });

// action: 'accept' | 'reject' (ผู้ขาย), 'cancel' (ผู้ซื้อ)
export const decide = (token, reservationId, action) =>
  apiFetch(`/api/reservations/${reservationId}`, { method: 'PATCH', token, body: { action } });

// ฉันเป็นผู้ซื้อ
export const myReservations = (token) => apiFetch('/api/me/reservations', { token });

// คนอื่นขอจองของของฉัน
export const myRequests = (token) => apiFetch('/api/me/requests', { token });
