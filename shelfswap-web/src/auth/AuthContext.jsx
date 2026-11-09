import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as api from '../api/auth';
import { SESSION_EXPIRED } from '../api/client';

// "กล่องกลาง" เก็บสถานะ login: Navbar, ListingActions, Dashboard, Admin ต้องรู้เหมือนกันหมดว่าใครล็อกอินอยู่
const AuthContext = createContext(null);

export const TOKEN_KEY = 'shelfswap.token';
export const USER_KEY = 'shelfswap.user';

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // อ่านค่าเดิมจาก localStorage จะได้ไม่หลุด login ตอน refresh
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readUser);
  const [notice, setNotice] = useState('');   // ข้อความตอนถูกเด้งออก เช่น "บัญชีถูกระงับ"

  const remember = useCallback((data) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  // ข้อมูลผู้ใช้เปลี่ยน (แก้โปรไฟล์) -> อัปเดตทั้ง state และ localStorage
  const updateUser = useCallback((u) => {
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }, []);

  async function login(email, password) {
    remember(await api.login(email, password)); // ผิดจะ throw ให้หน้า Login จับไปโชว์
    setNotice('');
  }

  async function register(email, password, displayName) {
    remember(await api.register(email, password, displayName));
    setNotice('');
  }

  // client.js ยิง event นี้เมื่อ server ตอบ 401/ถูกแบน ระหว่างใช้ token -> เด้งออกให้
  useEffect(() => {
    function onExpired(e) {
      logout();
      setNotice(e.detail || 'กรุณาเข้าสู่ระบบใหม่');
    }
    window.addEventListener(SESSION_EXPIRED, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED, onExpired);
  }, [logout]);

  // เปิดแอปมาแล้วมีตั๋วค้างอยู่: ถาม server ว่าตอนนี้เราเป็นใคร (role อาจเปลี่ยน, อาจโดนแบนไปแล้ว)
  useEffect(() => {
    if (!token) return;
    api.getMe(token).then((u) => u?.id && updateUser(u)).catch(() => {}); // 401/403 ถูกจัดการด้วย event ด้านบนแล้ว
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // isAdmin ใช้แค่ "โชว์/ซ่อน" เมนู การป้องกันจริงอยู่ที่ Go
  // ต่อให้แก้ localStorage ให้ role เป็น admin ก็ยิง /api/admin ไม่ผ่านอยู่ดี
  const value = {
    token,
    user,
    isLoggedIn: Boolean(token),
    isAdmin: user?.role === 'admin',
    notice,
    clearNotice: () => setNotice(''),
    login,
    register,
    logout,
    updateUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
