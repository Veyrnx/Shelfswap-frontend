import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// ตรวจเบื้องต้นฝั่ง React ให้ผู้ใช้รู้เร็ว แต่กติกาจริง (เช่น ไม่เกิน 72 ไบต์, อีเมลซ้ำ) Go ตรวจอีกรอบเสมอ
function validate({ displayName, email, password, confirm }) {
  if (!displayName.trim()) return 'กรุณากรอกชื่อที่แสดง';
  if (!email.includes('@')) return 'รูปแบบอีเมลไม่ถูกต้อง';
  if ([...password].length < 8) return 'รหัสผ่านต้องยาวอย่างน้อย 8 ตัวอักษร';
  if (password !== confirm) return 'รหัสผ่านทั้งสองช่องไม่ตรงกัน';
  return '';
}

function Register() {
  const { register, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ displayName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isLoggedIn) return <Navigate to="/" replace />;

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    const msg = validate(form);
    if (msg) return setError(msg);
    setError('');
    setBusy(true);
    try {
      await register(form.email.trim(), form.password, form.displayName.trim());
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message); // เช่น 409 อีเมลนี้มีบัญชีอยู่แล้ว
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-1 heading text-3xl">สมัครสมาชิก</h1>
      <p className="mb-6 text-sm text-muted">
        มีบัญชีแล้ว? <Link to="/login" state={location.state} className="text-ink hover:underline">เข้าสู่ระบบ</Link>
      </p>
      <form onSubmit={submit} noValidate className="card space-y-4 p-6">
        <div>
          <label htmlFor="displayName" className="label">ชื่อที่แสดง</label>
          <input id="displayName" maxLength={50} value={form.displayName} onChange={set('displayName')} className="input" />
        </div>
        <div>
          <label htmlFor="reg-email" className="label">อีเมล</label>
          <input id="reg-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} className="input" />
        </div>
        <div>
          <label htmlFor="reg-password" className="label">รหัสผ่าน (อย่างน้อย 8 ตัว)</label>
          <input id="reg-password" type="password" autoComplete="new-password" value={form.password} onChange={set('password')} className="input" />
        </div>
        <div>
          <label htmlFor="confirm" className="label">ยืนยันรหัสผ่าน</label>
          <input id="confirm" type="password" autoComplete="new-password" value={form.confirm} onChange={set('confirm')} className="input" />
        </div>
        {error && <p role="alert" className="rounded-lg bg-coral-soft px-3 py-2 text-sm text-coral-text">{error}</p>}
        <button disabled={busy} className="btn-primary w-full">{busy ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}</button>
      </form>
    </div>
  );
}

export default Register;
