import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { decide, myReservations } from '../../api/reservations';
import { useToast } from '../../components/ui/Toast';
import { EmptyState, ErrorState, RowsSkeleton } from '../../components/ui/States';
import ReservationCard from './ReservationCard';
import { useLoader } from '../../utils/useLoader';

// แท็บ "การจองของฉัน" (คนที่ 2): ของที่ฉันจองไว้ ยกเลิกได้ตอนผู้ขายยังไม่ตอบ
function MyReservations() {
  const { token } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useLoader(() => myReservations(token), [token]);

  async function cancel(id) {
    if (!window.confirm('ยกเลิกการจองนี้?')) return;
    try {
      await decide(token, id, 'cancel');
      toast.success('ยกเลิกการจองแล้ว');
    } catch (err) {
      toast.error(err.message);
    }
    reload();
  }

  if (loading && !data) return <RowsSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data.items.length) {
    return <EmptyState title="ยังไม่ได้จองอะไรเลย" action={<Link to="/" className="btn-primary">ไปหน้าร้าน</Link>} />;
  }

  return (
    <div className="space-y-3">
      {data.items.map((r) => (
        <ReservationCard key={r.id} r={r} viewer="buyer">
          {r.status === 'pending' && (
            <button className="btn-outline px-3 py-1.5" onClick={() => cancel(r.id)}>ยกเลิกการจอง</button>
          )}
        </ReservationCard>
      ))}
    </div>
  );
}

export default MyReservations;
