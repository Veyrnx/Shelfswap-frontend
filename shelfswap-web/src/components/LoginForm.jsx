import { useState } from 'react';

// ฟอร์ม login แยกออกจากหน้า Login เพื่อให้เทสต์ง่าย: ส่ง onSubmit(email, password) เข้ามา
// ตรวจช่องว่างก่อนยิง API (ไม่ต้องรอ server บอก) และโชว์ error ที่ server ตอบกลับ
function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await onSubmit(email.trim(), password);
    } catch (err) {
      setError(err.message);
      setBusy(false); // สำเร็จแล้วหน้าจะเปลี่ยนเอง ไม่ต้องปลด busy
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="email" className="label">อีเมล</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
      </div>
      <div>
        <label htmlFor="password" className="label">รหัสผ่าน</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-coral-soft px-3 py-2 text-sm text-coral-text">
          {error}
        </p>
      )}
      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </button>
    </form>
  );
}

export default LoginForm;
