import { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getCategories } from '../../api/listings';
import { createCategory, deleteCategory, updateCategory } from '../../api/admin';
import { useToast } from '../../components/ui/Toast';
import { ErrorState, RowsSkeleton } from '../../components/ui/States';
import { useLoader } from '../../utils/useLoader';

// หน้าจัดการหมวดหมู่ (คนที่ 1): เพิ่ม / แก้ในแถว / ลบ (หมวดที่ยังมีของ Go ตอบ 409)
function AdminCategories() {
  const { token } = useAuth();
  const toast = useToast();
  const { data, loading, error, reload } = useLoader(getCategories, []);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [editing, setEditing] = useState(null); // { id, name, slug }

  async function run(fn, ok) {
    try {
      await fn();
      toast.success(ok);
      reload();
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  }

  async function add(e) {
    e.preventDefault();
    if (await run(() => createCategory(token, form.name.trim(), form.slug.trim()), 'เพิ่มหมวดแล้ว')) {
      setForm({ name: '', slug: '' });
    }
  }

  async function saveEdit() {
    if (await run(() => updateCategory(token, editing.id, editing.name.trim(), editing.slug.trim()), 'บันทึกแล้ว')) {
      setEditing(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="heading text-3xl">หมวดหมู่</h1>

      <form onSubmit={add} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="c-name" className="label">ชื่อหมวด</label>
          <input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="เช่น อุปกรณ์ดนตรี" />
        </div>
        <div className="flex-1">
          <label htmlFor="c-slug" className="label">slug (a-z 0-9 -)</label>
          <input id="c-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase() })} className="input" placeholder="music" />
        </div>
        <button className="btn-primary" disabled={!form.name.trim() || !form.slug.trim()}>+ เพิ่ม</button>
      </form>

      {loading && !data ? (
        <RowsSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">ชื่อ</th>
                <th className="px-4 py-2 font-medium">slug</th>
                <th className="px-4 py-2 font-medium">ของบนหน้าร้าน</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {data.items.map((c) =>
                editing?.id === c.id ? (
                  <tr key={c.id} className="border-b border-line bg-surface">
                    <td className="px-4 py-2"><input aria-label="แก้ชื่อหมวด" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="input" /></td>
                    <td className="px-4 py-2"><input aria-label="แก้ slug" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase() })} className="input" /></td>
                    <td className="px-4 py-2">{c.listingCount}</td>
                    <td className="whitespace-nowrap px-4 py-2 text-right">
                      <button className="btn-primary px-3 py-1.5" onClick={saveEdit}>บันทึก</button>{' '}
                      <button className="btn-outline px-3 py-1.5" onClick={() => setEditing(null)}>ยกเลิก</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={c.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">{c.slug}</td>
                    <td className="px-4 py-3">{c.listingCount}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button className="btn-outline px-3 py-1.5" onClick={() => setEditing({ id: c.id, name: c.name, slug: c.slug })}>แก้ไข</button>{' '}
                      <button
                        className="btn-outline px-3 py-1.5 text-coral-text"
                        onClick={() => window.confirm(`ลบหมวด "${c.name}"?`) && run(() => deleteCategory(token, c.id), 'ลบหมวดแล้ว')}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
