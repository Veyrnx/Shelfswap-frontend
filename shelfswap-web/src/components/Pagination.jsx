// แบ่งหน้า: ← ก่อนหน้า 1 2 3 ถัดไป → (โชว์เลขรอบหน้าปัจจุบัน ±2)
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const from = Math.max(1, page - 2);
  const to = Math.min(totalPages, page + 2);
  const pages = [];
  for (let p = from; p <= to; p++) pages.push(p);

  const num = 'flex h-11 w-11 items-center justify-center rounded-full text-sm transition';
  return (
    <nav className="mt-14 flex items-center justify-center gap-1" aria-label="แบ่งหน้า">
      <button className="px-3 py-2 text-sm text-ink hover:text-hover disabled:text-muted/50" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← ก่อนหน้า
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={p === page ? `${num} bg-accent font-medium text-primary` : `${num} text-ink hover:bg-surface`}
        >
          {p}
        </button>
      ))}
      <button className="px-3 py-2 text-sm text-ink hover:text-hover disabled:text-muted/50" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        ถัดไป →
      </button>
    </nav>
  );
}

export default Pagination;
