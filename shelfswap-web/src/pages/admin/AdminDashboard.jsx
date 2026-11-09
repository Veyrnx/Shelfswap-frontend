import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { adminListings, getStats, reviewListing } from '../../api/admin';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../components/ui/Toast';
import { EmptyState, ErrorState, RowsSkeleton, Skeleton } from '../../components/ui/States';
import { formatDate, formatPrice } from '../../utils/format';
import { useLoader } from '../../utils/useLoader';

const CARDS = [
  ['pendingListings', 'ประกาศรออนุมัติ', 'text-peach-ink'],
  ['availableListings', 'พร้อมขาย', 'text-ink'],
  ['reservedListings', 'ติดจอง', 'text-ink'],
  ['soldListings', 'ขายแล้ว', 'text-ink'],
  ['users', 'ผู้ใช้ทั้งหมด', 'text-ink'],
  ['bannedUsers', 'ถูกแบน', 'text-coral-text'],
  ['pendingReservations', 'คำขอจองรอตอบ', 'text-ink'],
  ['categories', 'หมวดหมู่', 'text-ink'],
];

// หน้าภาพรวม Admin (คนที่ 2): Stat Cards + ตารางประกาศรออนุมัติ
// เส้นทางในคลิป: Admin กดอนุมัติ -> PATCH /api/admin/listings/:id -> status = available -> ประกาศขึ้นหน้าร้าน
function AdminDashboard() {
  const { token } = useAuth();
  const toast = useToast();
  const stats = useLoader(() => getStats(token), [token]);
  const pending = useLoader(() => adminListings(token, 'pending'), [token]);
  const [rejecting, setRejecting] = useState(null); // ประกาศที่กำลังจะไม่อนุมัติ (เปิด Modal ใส่เหตุผล)
  const [reason, setReason] = useState('');

  async function review(listing, action, why = '') {
    try {
      await reviewListing(token, listing.id, action, why);
      toast.success(action === 'approve' ? `อนุมัติ "${listing.title}" แล้ว` : 'ไม่อนุมัติแล้ว ผู้ขายจะเห็นเหตุผล');
      setRejecting(null);
      setReason('');
    } catch (err) {
      toast.error(err.message);
    }
    pending.reload();
    stats.reload();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 heading text-3xl">ภาพรวม</h1>
        {stats.error ? (
          <ErrorState message={stats.error} onRetry={stats.reload} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CARDS.map(([key, label, color]) => (
              <div key={key} className="card p-4">
                <p className="text-sm text-muted">{label}</p>
                {stats.data ? (
                  <p className={`mt-1 text-3xl font-semibold ${color}`}>{stats.data[key]}</p>
                ) : (
                  <Skeleton className="mt-2 h-8 w-12" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">ประกาศรออนุมัติ</h2>
        {pending.loading && !pending.data ? (
          <RowsSkeleton />
        ) : pending.error ? (
          <ErrorState message={pending.error} onRetry={pending.reload} />
        ) : !pending.data.items.length ? (
          <EmptyState title="ไม่มีประกาศค้างตรวจ" />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-surface text-muted">
                <tr>
                  <th className="px-4 py-2 font-medium">สินค้า</th>
                  <th className="px-4 py-2 font-medium">ผู้ขาย</th>
                  <th className="px-4 py-2 font-medium">ราคา</th>
                  <th className="px-4 py-2 font-medium">ส่งเมื่อ</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {pending.data.items.map((l) => (
                  <tr key={l.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <Link to={`/listings/${l.id}`} className="font-medium hover:text-hover">{l.title}</Link>
                      <p className="text-xs text-muted">{l.categoryName}</p>
                    </td>
                    <td className="px-4 py-3">{l.sellerName}</td>
                    <td className="px-4 py-3">{formatPrice(l.price)}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(l.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button className="btn-primary px-3 py-1.5" onClick={() => review(l, 'approve')}>อนุมัติ</button>{' '}
                      <button className="btn-outline px-3 py-1.5" onClick={() => setRejecting(l)}>ไม่อนุมัติ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={Boolean(rejecting)} title="ไม่อนุมัติประกาศ" onClose={() => setRejecting(null)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            review(rejecting, 'reject', reason.trim());
          }}
          className="space-y-4"
        >
          <p className="text-sm text-ink">“{rejecting?.title}”</p>
          <div>
            <label htmlFor="reason" className="label">เหตุผล (ผู้ขายจะเห็นข้อความนี้)</label>
            <textarea id="reason" rows={3} maxLength={200} required value={reason} onChange={(e) => setReason(e.target.value)} className="input-box" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-outline" onClick={() => setRejecting(null)}>ยกเลิก</button>
            <button className="btn-danger" disabled={!reason.trim()}>ไม่อนุมัติ</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AdminDashboard;
