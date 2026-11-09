import { useAuth } from '../../auth/AuthContext';
import { decide, myRequests } from '../../api/reservations';
import { useToast } from '../../components/ui/Toast';
import { EmptyState, ErrorState, RowsSkeleton } from '../../components/ui/States';
import ReservationCard from './ReservationCard';
import { useLoader } from '../../utils/useLoader';

// แท็บ "คำขอจอง" (คนที่ 2): คนอื่นขอจองของของฉัน -> ยืนยัน / ปฏิเสธ
// ปฏิเสธแล้ว Go คืนของกลับเป็น "พร้อมขาย" ให้ในทรานแซกชันเดียวกัน
function IncomingRequests() {
  const { token } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useLoader(() => myRequests(token), [token]);

  async function answer(id, action) {
    try {
      await decide(token, id, action);
      toast.success(action === 'accept' ? 'ยืนยันการจองแล้ว ตอนนี้ผู้จองเห็นเบอร์ของคุณ' : 'ปฏิเสธแล้ว ของกลับไปพร้อมขาย');
      reload();
    } catch (err) {
      toast.error(err.message);
      reload(); // 409 = สถานะเปลี่ยนไปแล้ว (เช่นผู้ซื้อยกเลิกพอดี) โหลดใหม่ให้เห็นของจริง
    }
  }

  if (loading && !data) return <RowsSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data.items.length) return <EmptyState title="ยังไม่มีใครขอจองของของคุณ" />;

  return (
    <div className="space-y-3">
      {data.items.map((r) => (
        <ReservationCard key={r.id} r={r} viewer="seller">
          {r.status === 'pending' && (
            <>
              <button className="btn-primary px-3 py-1.5" onClick={() => answer(r.id, 'accept')}>ยืนยัน</button>
              <button className="btn-outline px-3 py-1.5" onClick={() => answer(r.id, 'reject')}>ปฏิเสธ</button>
            </>
          )}
        </ReservationCard>
      ))}
    </div>
  );
}

export default IncomingRequests;
