import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { listUsers, setBanned } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { EmptyState, ErrorState, RowsSkeleton } from '../../components/ui/States';
import { formatDate } from '../../utils/format';
import { useLoader } from '../../utils/useLoader';

// หน้าจัดการผู้ใช้ (คนที่ 1): ค้นหา + แบน/ปลดแบน
// เส้นทางในคลิป: กดแบน -> PUT /api/admin/users/:id/ban -> is_banned = true
//               -> ผู้ใช้นั้นเรียก API ครั้งถัดไป RequireLogin ถาม DB เจอว่าถูกแบน -> 403
function AdminUsers() {
  const { token, user: me } = useAuth();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const { data, loading, error, reload } = useLoader(() => listUsers(token, search), [token, search]);

  async function toggleBan(u) {
    const next = !u.isBanned;
    if (next && !window.confirm(`แบน ${u.displayName}? คนนี้จะใช้งานไม่ได้ทันที และของที่ประกาศไว้จะหายจากหน้าร้าน`)) return;
    try {
      await setBanned(token, u.id, next);
      toast.success(next ? `แบน ${u.displayName} แล้ว` : `ปลดแบน ${u.displayName} แล้ว`);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="heading text-3xl">ผู้ใช้</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(q.trim());
        }}
        className="flex gap-2"
      >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ค้นหาด้วยอีเมลหรือชื่อ" aria-label="ค้นหาผู้ใช้" className="input" />
        <button className="btn-outline">ค้นหา</button>
      </form>

      {loading && !data ? (
        <RowsSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : !data.items.length ? (
        <EmptyState title="ไม่พบผู้ใช้" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">ผู้ใช้</th>
                <th className="px-4 py-2 font-medium">บทบาท</th>
                <th className="px-4 py-2 font-medium">ประกาศ</th>
                <th className="px-4 py-2 font-medium">สมัครเมื่อ</th>
                <th className="px-4 py-2 font-medium">สถานะ</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.displayName}{u.id === me?.id && ' (คุณ)'}</p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3">{u.listingCount}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    {u.isBanned ? (
                      <span className="rounded-full bg-coral px-2 py-0.5 text-xs text-coral-text">ถูกแบน</span>
                    ) : (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-ink">ปกติ</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role !== 'admin' && (
                      <button className={u.isBanned ? 'btn-outline px-3 py-1.5' : 'btn-danger px-3 py-1.5'} onClick={() => toggleBan(u)}>
                        {u.isBanned ? 'ปลดแบน' : 'แบน'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
