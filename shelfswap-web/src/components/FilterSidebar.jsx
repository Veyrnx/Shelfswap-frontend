import { useEffect, useState } from 'react';
import { CONDITIONS } from '../utils/format';

const EMPTY = { category: '', condition: '', minPrice: '', maxPrice: '' };

// แถบตัวกรอง: เลือกได้ตามสบาย ค่าจะถูกส่งออกไปตอนกด "ใช้ตัวกรอง" เท่านั้น
// (ถ้าส่งทุกครั้งที่พิมพ์ จะยิง API ทุกตัวอักษร)
// props: categories = [{id, name, listingCount}], value = ตัวกรองปัจจุบัน, onChange(ตัวกรองใหม่)
//
// หน้าตา: หมวดเป็นรายการข้อความ สภาพเป็นปุ่มเม็ดยา แต่ข้างในยังเป็น <input type="radio"> จริง
// (ซ่อนด้วย sr-only) คีย์บอร์ดและโปรแกรมอ่านหน้าจอจึงใช้ได้เหมือนเดิม
function FilterSidebar({ categories = [], value = EMPTY, onChange }) {
  const [draft, setDraft] = useState({ ...EMPTY, ...value });
  const [error, setError] = useState('');

  // ค่าจาก URL เปลี่ยน (เช่นกดย้อนกลับ) ให้ฟอร์มตาม
  // เทียบด้วยข้อความ JSON เพราะ object ที่ส่งมาเป็นตัวใหม่ทุกครั้งที่ parent render
  const valueKey = JSON.stringify(value);
  useEffect(() => setDraft({ ...EMPTY, ...JSON.parse(valueKey) }), [valueKey]);

  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));
  function changeCategory(e) {
  const category = e.target.value;

  setDraft((d) => ({ ...d, category }));
  setError('');

  onChange({ category });
}
  const total = categories.reduce((n, c) => n + c.listingCount, 0);

  function apply(e) {
    e.preventDefault();
    const min = draft.minPrice === '' ? null : Number(draft.minPrice);
    const max = draft.maxPrice === '' ? null : Number(draft.maxPrice);
    if (min !== null && max !== null && min > max) {
      setError('ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด');
      return;
    }
    setError('');
    onChange(draft);
  }

  function reset() {
    setDraft(EMPTY);
    setError('');
    onChange(EMPTY);
  }

  return (
    <form onSubmit={apply} className="space-y-8 text-sm" aria-label="ตัวกรองสินค้า">
      <fieldset>
        <legend className="eyebrow mb-3">หมวดหมู่</legend>
        <div className="flex flex-col gap-1">
          {[{ id: '', name: 'ทั้งหมด', listingCount: total }, ...categories].map((c) => {
            const checked = draft.category === String(c.id);
            return (
              <label
                key={c.id}
                className={`flex cursor-pointer justify-between gap-3 rounded py-1 transition hover:text-hover ${checked ? 'font-semibold text-ink' : 'text-muted'}`}
              >
                <input type="radio" name="category" value={String(c.id)} checked={checked} onChange={changeCategory} className="sr-only" />
                <span>{c.name}</span>
                <span className="text-muted">{c.listingCount}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3">สภาพ</legend>
        <div className="flex flex-wrap gap-2">
          {[{ value: '', label: 'ทั้งหมด' }, ...CONDITIONS].map((c) => (
            <label key={c.value} className={`pill cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${draft.condition === c.value ? 'pill-active' : ''}`}>
              <input
                type="radio"
                name="condition"
                value={c.value}
                checked={draft.condition === c.value}
                onChange={set('condition')}
                className="sr-only"
              />
              {c.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="eyebrow mb-3">ราคา (บาท)</legend>
        <div className="flex items-center gap-3">
          <input type="number" min="0" placeholder="0" aria-label="ราคาต่ำสุด" value={draft.minPrice} onChange={set('minPrice')} className="input" />
          <span className="text-muted">–</span>
          <input type="number" min="0" placeholder="1,000" aria-label="ราคาสูงสุด" value={draft.maxPrice} onChange={set('maxPrice')} className="input" />
        </div>
        {error && <p role="alert" className="mt-2 text-sm text-coral-text">{error}</p>}
      </fieldset>

      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex-1">ใช้ตัวกรอง</button>
        <button type="button" onClick={reset} className="btn-outline">ล้าง</button>
      </div>
    </form>
  );
}

export default FilterSidebar;
