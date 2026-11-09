// ชั้นกลางสำหรับคุยกับ Go API ทุกฟังก์ชันในโฟลเดอร์ api/ เรียกผ่าน apiFetch ตัวเดียว
// '' = origin เดียวกับหน้าเว็บ ตอน npm start CRA จะ proxy /api ไปที่ http://localhost:8080 ให้ (ตั้งใน package.json)
// บน Vercel ตั้ง REACT_APP_API_URL=https://<ชื่อ>.onrender.com
const BASE = process.env.REACT_APP_API_URL || '';

// ชื่อ event ที่ AuthContext ฟังอยู่: server บอกว่าตั๋วใช้ไม่ได้แล้ว -> ออกจากระบบให้อัตโนมัติ
export const SESSION_EXPIRED = 'shelfswap:session-expired';

export async function apiFetch(path, { method = 'GET', body, token } = {}) {

  const headers = {};
  const isFormData = body instanceof FormData;

  if (body !== undefined && !isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) headers.Authorization = `Bearer ${token}`;


  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,

      body: body !== undefined
        ? (isFormData ? body : JSON.stringify(body))
        : undefined,

    });
  } catch {
    // fetch โยน error เฉพาะตอนต่อไม่ได้เลย (server หลับ / CORS ไม่ผ่าน / เน็ตหลุด)
    const err = new Error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ ลองใหม่อีกครั้ง (ถ้าเพิ่งเปิด Render อาจต้องรอ ~1 นาที)');
    err.status = 0;
    throw err;
  }

  if (res.status === 204) return null; // สำเร็จแต่ไม่มี body เช่น DELETE

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Go ตอบ {"error": {"code": "...", "message": "..."}} ทุก endpoint
    const err = new Error(data.error?.message ?? `เซิร์ฟเวอร์ตอบกลับ ${res.status}`);
    err.status = res.status;
    err.code = data.error?.code;
    // มีตั๋วแต่โดน 401 = ตั๋วหมดอายุ/เสีย, ACCOUNT_BANNED = ถูกแบนระหว่างใช้งาน
    if (token && (res.status === 401 || err.code === 'ACCOUNT_BANNED')) {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED, { detail: err.message }));
    }
    throw err;
  }
  return data;
}

// toQuery({ q: 'casio', page: 1, category: '' }) -> '?q=casio&page=1' (ตัดค่าว่างทิ้ง)
export function toQuery(params) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
}
