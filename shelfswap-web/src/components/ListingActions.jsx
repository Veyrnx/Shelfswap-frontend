import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { deleteListing, markSold } from '../api/listings';
import { useToast } from './ui/Toast';
import ReserveModal from './ReserveModal';

// ปุ่มบนหน้า Detail (ส่วนของคนที่ 2) เปลี่ยนตามว่าใครดูอยู่:
//   Guest            -> ปุ่มจอง กดแล้วพาไปหน้า Login (login เสร็จกลับมาหน้านี้)
//   เจ้าของประกาศ     -> แก้ไข / ทำเครื่องหมายขายแล้ว / ลบ
//   สมาชิกคนอื่น      -> ปุ่มจอง (ถ้ายังว่าง)
// ปุ่มเป็นแค่ความสะดวก ด่านจริงอยู่ที่ Go (จองของตัวเอง/ของติดจอง ได้ 400/409)
function ListingActions({ listing, onChanged }) {
  const { isLoggedIn, user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const isOwner = isLoggedIn && user?.id === listing.sellerId;

  async function run(fn, okMessage) {
    setBusy(true);
    try {
      await fn();
      toast.success(okMessage);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  if (isOwner) {
    const editable = ['pending', 'available', 'rejected'].includes(listing.status);
    const sellable = ['available', 'reserved'].includes(listing.status);
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted">นี่คือประกาศของคุณ</p>
        <div className="flex flex-wrap gap-2">
          {editable && (
            <Link to={`/listings/${listing.id}/edit`} className="btn-outline">แก้ไขประกาศ</Link>
          )}
          {sellable && (
            <button
              disabled={busy}
              className="btn-primary"
              onClick={() => run(() => markSold(token, listing.id), 'บันทึกว่าขายแล้ว').then((ok) => ok && onChanged?.())}
            >
              ขายแล้ว
            </button>
          )}
          {listing.status !== 'reserved' && (
            <button
              disabled={busy}
              className="btn-danger"
              onClick={async () => {
                if (!window.confirm('ลบประกาศนี้ถาวร?')) return;
                if (await run(() => deleteListing(token, listing.id), 'ลบประกาศแล้ว')) navigate('/me');
              }}
            >
              ลบ
            </button>
          )}
        </div>
        {listing.status === 'reserved' && (
          <p className="text-sm text-ink">มีคนจองอยู่ ตอบคำขอได้ที่ <Link to="/me/requests" className="underline">คำขอจอง</Link></p>
        )}
      </div>
    );
  }

  if (listing.status !== 'available') {
    const text = { reserved: 'มีคนจองแล้ว', sold: 'ขายแล้ว' }[listing.status] ?? 'ยังไม่เปิดให้จอง';
    return <button disabled className="btn-outline w-full sm:w-auto">{text}</button>;
  }

  function handleReserve() {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <button onClick={handleReserve} className="btn-primary w-full py-3 text-base sm:w-auto">
        จองสินค้านี้
      </button>
      {!isLoggedIn && <p className="mt-2 text-sm text-muted">ต้องเข้าสู่ระบบก่อนจอง</p>}
      {isLoggedIn && (
        <ReserveModal
          listing={listing}
          open={open}
          onClose={() => setOpen(false)}
          onReserved={() => {
            setOpen(false);
            toast.success('ส่งคำขอจองแล้ว รอผู้ขายยืนยัน');
            onChanged?.();
          }}
        />
      )}
    </>
  );
}

export default ListingActions;
