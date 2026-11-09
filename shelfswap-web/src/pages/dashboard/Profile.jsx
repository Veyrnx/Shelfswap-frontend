import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { changePassword, updateMe } from '../../api/auth';
import { useToast } from '../../components/ui/Toast';

// แท็บ "โปรไฟล์" (คนที่ 1): แก้ชื่อ/เบอร์ และเปลี่ยนรหัสผ่าน
function Profile() {
  const { token, user, updateUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState({ displayName: user?.displayName ?? '', phone: user?.phone ?? '' });
  const [pErr, setPErr] = useState('');
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErr, setPwErr] = useState('');
  const [busy, setBusy] = useState('');

  async function saveProfile(e) {
    e.preventDefault();
    setBusy('profile');
    setPErr('');
    try {
      updateUser(await updateMe(token, profile)); // Navbar เปลี่ยนชื่อตามทันที
      toast.success('บันทึกโปรไฟล์แล้ว');
    } catch (err) {
      setPErr(err.message);
    } finally {
      setBusy('');
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    if (pw.next !== pw.confirm) return setPwErr('รหัสผ่านใหม่ทั้งสองช่องไม่ตรงกัน');
    setBusy('pw');
    setPwErr('');
    try {
      await changePassword(token, pw.current, pw.next);
      setPw({ current: '', next: '', confirm: '' });
      toast.success('เปลี่ยนรหัสผ่านแล้ว');
    } catch (err) {
      setPwErr(err.message); // รหัสเดิมผิด Go ตอบ 400 (ไม่ใช่ 401) จึงไม่โดนเด้งออก
    } finally {
      setBusy('');
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={saveProfile} className="card space-y-4 p-6">
        <h2 className="font-semibold">ข้อมูลส่วนตัว</h2>
        <div>
          <p className="label">อีเมล</p>
          <p className="text-sm text-ink">{user?.email}</p>
        </div>
        <div>
          <label htmlFor="p-name" className="label">ชื่อที่แสดง</label>
          <input id="p-name" maxLength={50} value={profile.displayName} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} className="input" />
        </div>
        <div>
          <label htmlFor="p-phone" className="label">เบอร์โทร</label>
          <input id="p-phone" maxLength={20} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input" placeholder="08x-xxx-xxxx" />
          <p className="mt-1 text-xs text-muted">อีกฝ่ายจะเห็นเบอร์นี้เฉพาะเมื่อการจองถูกยืนยันแล้ว</p>
        </div>
        {pErr && <p role="alert" className="text-sm text-coral-text">{pErr}</p>}
        <button disabled={busy === 'profile'} className="btn-primary">บันทึก</button>
      </form>

      <form onSubmit={savePassword} className="card space-y-4 p-6">
        <h2 className="font-semibold">เปลี่ยนรหัสผ่าน</h2>
        <div>
          <label htmlFor="pw-current" className="label">รหัสผ่านปัจจุบัน</label>
          <input id="pw-current" type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className="input" />
        </div>
        <div>
          <label htmlFor="pw-next" className="label">รหัสผ่านใหม่ (อย่างน้อย 8 ตัว)</label>
          <input id="pw-next" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className="input" />
        </div>
        <div>
          <label htmlFor="pw-confirm" className="label">ยืนยันรหัสผ่านใหม่</label>
          <input id="pw-confirm" type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className="input" />
        </div>
        {pwErr && <p role="alert" className="text-sm text-coral-text">{pwErr}</p>}
        <button disabled={busy === 'pw' || !pw.current || !pw.next} className="btn-primary">เปลี่ยนรหัสผ่าน</button>
      </form>
    </div>
  );
}

export default Profile;
