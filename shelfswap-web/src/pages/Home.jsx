import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import FilterSidebar from '../components/FilterSidebar';
import ListingGrid from '../components/ListingGrid';
import Pagination from '../components/Pagination';
import { getCategories, searchListings } from '../api/listings';
import { SORTS } from '../utils/format';

const FILTER_KEYS = ['q', 'category', 'condition', 'minPrice', 'maxPrice', 'sort', 'page'];

// หน้าร้าน (คนที่ 1)
// ตัวกรองทั้งหมดเก็บใน URL (?category=3&page=2) ไม่ใช่ใน useState
// ข้อดี: refresh ไม่หาย, กดย้อนกลับได้, ส่งลิงก์ให้เพื่อนแล้วเห็นผลเดียวกัน
// เส้นทางในคลิป: FilterSidebar -> setSearchParams -> useEffect -> GET /api/listings?... -> SQL WHERE -> Grid
function Home() {
  const [params, setParams] = useSearchParams();
  const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) ?? '']));
  const page = Number(filters.page) || 1;

  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({ items: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false); // มือถือ: ซ่อนตัวกรองไว้ก่อน กดเปิดเอง

  useEffect(() => {
    getCategories().then((d) => setCategories(d.items)).catch(() => {}); // หมวดโหลดไม่ขึ้น กริดยังใช้ได้
  }, []);

  const query = params.toString(); // ใช้ข้อความเป็น dependency (object ใหม่ทุก render)
  const load = useCallback(() => {
    setLoading(true);
    setError('');
    searchListings({ ...Object.fromEntries(new URLSearchParams(query)), pageSize: 12 })
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  useEffect(load, [load]);

  // อัปเดต URL: เปลี่ยนตัวกรองแล้วกลับไปหน้า 1 เสมอ
  function update(changes, { keepPage = false } = {}) {
    const next = { ...filters, ...changes };
    if (!keepPage) next.page = '';
    const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v !== '' && v != null));
    setParams(clean);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const sidebarValue = {
    category: filters.category,
    condition: filters.condition,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  };
  const hasFilter = FILTER_KEYS.some((k) => k !== 'page' && k !== 'sort' && filters[k]);

  return (
    <>
      <Hero initialQuery={filters.q} onSearch={(q) => update({ q })} />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-8 sm:px-8 lg:grid-cols-[210px_1fr] lg:gap-14">
        <aside>
          <button className="pill w-full justify-center lg:hidden" onClick={() => setShowFilters((v) => !v)} aria-expanded={showFilters}>
            {showFilters ? 'ซ่อนตัวกรอง' : 'ตัวกรอง'}
          </button>
          <div className={`${showFilters ? 'mt-6 block' : 'hidden'} lg:mt-0 lg:block`}>
            <FilterSidebar
              categories={categories}
              value={sidebarValue}
              onChange={(f) => {
                update(f);
                setShowFilters(false);
              }}
            />
          </div>
        </aside>
        <section>
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <p className="text-sm text-muted">
              {loading ? 'กำลังโหลด...' : `พบ ${data.total} รายการ`}
              {filters.q && <> สำหรับ “<span className="font-medium text-ink">{filters.q}</span>”</>}
            </p>
            <label className="flex items-center gap-2 text-sm text-muted">
              เรียงตาม
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => update({ sort: e.target.value === 'newest' ? '' : e.target.value })}
                className="input w-auto py-1 pr-6"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          <ListingGrid
            items={data.items}
            loading={loading}
            error={error}
            onRetry={load}
            emptyAction={hasFilter && <button className="btn-outline" onClick={() => setParams({})}>ล้างตัวกรองทั้งหมด</button>}
          />
          <Pagination page={page} totalPages={data.totalPages} onChange={(p) => update({ page: String(p) }, { keepPage: true })} />
        </section>
      </div>
    </>
  );
}

export default Home;
