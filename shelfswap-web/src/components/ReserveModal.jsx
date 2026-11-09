import { useState } from 'react';
import Modal from './ui/Modal';
import { reserve } from '../api/reservations';
import { useAuth } from '../auth/AuthContext';
import { formatPrice } from '../utils/format';

// กล่องยืนยันการจอง พิมพ์ข้อความถึงผู้ขายได้ (เช่น เวลา/สถานที่นัดรับ)
function ReserveModal({ listing, open, onClose, onReserved }) {
  const { token } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function confirm(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await reserve(token, listing.id, message.trim());
      setMessage('');
      onReserved(res);
    } catch (err) {
      // 409 = มีคนจองตัดหน้าไปแล้ว (สองคนกดพร้อมกัน Go ปล่อยผ่านแค่คนเดียว)
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} title="ยืนยันการจอง" onClose={onClose}>
      <form onSubmit={confirm} className="space-y-4">
        <div className="rounded-lg bg-surface p-3 text-sm">
          <p className="font-medium">{listing.title}</p>
          <p className="text-ink">{formatPrice(listing.price)} · ผู้ขาย {listing.sellerName}</p>
        </div>
        <div>
          <label htmlFor="reserve-message" className="label">ข้อความถึงผู้ขาย (ไม่บังคับ)</label>
          <textarea
            id="reserve-message"
            rows={3}
            maxLength={300}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="เช่น สะดวกรับวันพุธหลังเลิกเรียนที่ตึกคณะ"
            className="input-box"
          />
          <p className="mt-1 text-right text-xs text-muted">{message.length}/300</p>
        </div>
        <p className="text-xs text-muted">เมื่อผู้ขายยืนยัน คุณจะเห็นเบอร์โทรของผู้ขายในหน้า "การจองของฉัน"</p>
        {error && <p role="alert" className="rounded-lg bg-coral-soft px-3 py-2 text-sm text-coral-text">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-outline">ยกเลิก</button>
          <button type="submit" disabled={busy} className="btn-primary">{busy ? 'กำลังจอง...' : 'ยืนยันจอง'}</button>
        </div>
      </form>
    </Modal>
  );
}

export default ReserveModal;
