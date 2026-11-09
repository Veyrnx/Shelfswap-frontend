import { createContext, useCallback, useContext, useState } from 'react';

// Toast = ข้อความเด้งมุมจอแล้วหายเอง ใช้แจ้งผลสั้น ๆ เช่น "จองสำเร็จ"
// ห่อแอปด้วย <ToastProvider> แล้วเรียก const toast = useToast(); toast.success('...')
const ToastContext = createContext(null);

const STYLES = {
  success: 'bg-primary',
  error: 'bg-coral-text',
  info: 'bg-primary',
};

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, type, message }]);
    setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3500);
  }, []);

  const api = {
    success: (m) => push('success', m),
    error: (m) => push('error', m),
    info: (m) => push('info', m),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto rounded-lg px-4 py-2 text-sm text-white ${STYLES[t.type]}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ใช้นอก ToastProvider (เช่นในเทสต์) จะได้ตัวเปล่าที่ไม่ทำอะไร ไม่พัง
const noop = { success() {}, error() {}, info() {} };
export function useToast() {
  return useContext(ToastContext) ?? noop;
}
