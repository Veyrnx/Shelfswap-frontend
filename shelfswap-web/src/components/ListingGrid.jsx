import ListingCard from './ListingCard';
import { CardSkeleton, EmptyState, ErrorState } from './ui/States';

const GRID = 'grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4';

// กริดสินค้า + สถานะ Loading / Error / Empty ครบในที่เดียว
function ListingGrid({ items, loading, error, onRetry, emptyAction }) {
  if (loading) {
    return (
      <div className={GRID} aria-busy="true">
        {Array.from({ length: 8 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!items?.length) {
    return <EmptyState title="ไม่พบสินค้าที่ตรงกับเงื่อนไข" hint="ลองเปลี่ยนคำค้นหรือล้างตัวกรอง" action={emptyAction} />;
  }
  return (
    <div className={GRID}>
      {items.map((l) => (
        <ListingCard key={l.id} listing={l} />
      ))}
    </div>
  );
}

export default ListingGrid;
