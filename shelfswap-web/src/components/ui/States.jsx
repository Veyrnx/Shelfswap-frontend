// สถานะ UI ที่ใช้ทุกหน้า: กำลังโหลด / ไม่มีข้อมูล / ผิดพลาด (เกณฑ์ API / Database / UI)

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded bg-surface ${className}`} />;
}

// โครงการ์ดสินค้าตอนกำลังโหลด หน้าตาเหมือน ListingCard จอจะได้ไม่กระตุก
export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3" data-testid="card-skeleton">
      <Skeleton className="aspect-[4/5]" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

export function RowsSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-20" />
      ))}
    </div>
  );
}

export function EmptyState({ title, hint, action }) {
  return (
    <div className="border-y border-line px-6 py-16 text-center">
      <p className="heading text-xl">{title}</p>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div role="alert" className="rounded-lg bg-coral-soft px-6 py-10 text-center">
      <p className="font-medium text-coral-text">โหลดข้อมูลไม่สำเร็จ</p>
      <p className="mt-1 text-sm text-coral-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-outline mt-5">
          ลองอีกครั้ง
        </button>
      )}
    </div>
  );
}
