import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { deleteListing, markSold, myListings } from '../../api/listings';
import StatusBadge from '../../components/StatusBadge';
import { useToast } from '../../components/ui/Toast';
import { EmptyState, ErrorState, RowsSkeleton } from '../../components/ui/States';
import ProductImage from '../../components/ProductImage';
import { formatDate, formatPrice } from '../../utils/format';
import { useLoader } from '../../utils/useLoader';

// แท็บ "ขายของฉัน" (คนที่ 2): ประกาศทุกสถานะของฉัน + ปุ่มจัดการ
function MyListings() {
  const { token } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useLoader(() => myListings(token), [token]);

  async function act(fn, ok) {
    try {
      await fn();
      toast.success(ok);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading && !data) return <RowsSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!data.items.length) {
    return (
      <EmptyState
        title="ยังไม่มีประกาศ"
        hint="ของที่ไม่ใช้แล้ว ส่งต่อให้รุ่นน้องได้นะ"
        action={<Link to="/listings/new" className="btn-primary">ลงประกาศแรก</Link>}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Link to="/listings/new" className="btn-primary">+ ลงประกาศ</Link>
      </div>
      {data.items.map((l) => (
        <div key={l.id} className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <ProductImage listing={l} className="h-24 w-20 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={l.status} />
              {l.pendingRequests > 0 && (
                <Link to="/me/requests" className="rounded-full bg-coral px-2 py-0.5 text-xs text-coral-text">
                  คำขอจองรอตอบ {l.pendingRequests}
                </Link>
              )}
            </div>
            <Link to={`/listings/${l.id}`} className="mt-1 block truncate font-medium hover:text-hover">{l.title}</Link>
            <p className="text-sm text-muted">{formatPrice(l.price)} · ลงเมื่อ {formatDate(l.createdAt)}</p>
            {l.status === 'rejected' && <p className="text-sm text-coral-text">เหตุผล: {l.rejectReason}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {['pending', 'available', 'rejected'].includes(l.status) && (
              <Link to={`/listings/${l.id}/edit`} className="btn-outline px-3 py-1.5">แก้ไข</Link>
            )}
            {['available', 'reserved'].includes(l.status) && (
              <button className="btn-primary px-3 py-1.5" onClick={() => act(() => markSold(token, l.id), 'บันทึกว่าขายแล้ว')}>
                ขายแล้ว
              </button>
            )}
            {l.status !== 'reserved' && (
              <button
                className="btn-outline px-3 py-1.5 text-coral-text"
                onClick={() => window.confirm(`ลบ "${l.title}"?`) && act(() => deleteListing(token, l.id), 'ลบประกาศแล้ว')}
              >
                ลบ
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyListings;
