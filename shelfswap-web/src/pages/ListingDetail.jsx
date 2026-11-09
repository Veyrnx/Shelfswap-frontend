import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getListing } from '../api/listings';
import { useAuth } from '../auth/AuthContext';
import ListingActions from '../components/ListingActions';
import StatusBadge from '../components/StatusBadge';
import { ErrorState, Skeleton } from '../components/ui/States';
import ProductImage from '../components/ProductImage';
import { conditionLabel, formatDate, formatPrice } from '../utils/format';

// หน้า Detail: คนที่ 1 ทำส่วนแสดงข้อมูล คนที่ 2 ทำ <ListingActions/> (ปุ่ม) มาต่อกันที่นี่
function ListingDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    getListing(id, token) // ส่ง token ไปด้วย เจ้าของจะเห็นประกาศที่ยังรออนุมัติ
      .then(setListing)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id, token]);

  useEffect(load, [load]);

  if (loading && !listing) {
    return (
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-8 md:grid-cols-2">
        <Skeleton className="aspect-[4/3]" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }
  if (error?.status === 404) {
    return (
      <div className="px-4 py-24 text-center">
                <p className="mt-3 text-muted">ไม่พบประกาศนี้ อาจถูกลบหรือยังไม่ผ่านการอนุมัติ</p>
        <Link to="/" className="btn-outline mt-4">กลับหน้าร้าน</Link>
      </div>
    );
  }
  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <ErrorState message={error.message} onRetry={load} />
      </div>
    );
  }

  const l = listing;
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:px-8">
      <nav aria-label="ตำแหน่ง" className="mb-8 text-sm text-muted">
        <Link to="/" className="hover:text-hover">หน้าร้าน</Link> <span aria-hidden="true">/</span>{' '}
        <Link to={`/?category=${l.categoryId}`} className="hover:text-hover">{l.categoryName}</Link>
      </nav>

      <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
        <ProductImage listing={l} className="aspect-[4/5] w-full max-w-[520px]" />

        <div className="space-y-7">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={l.status} />
            <span className="rounded-full border border-field px-3 py-0.5 text-xs text-muted">{conditionLabel(l.condition)}</span>
          </div>
          <div>
            <h1 className="heading text-3xl leading-snug sm:text-4xl">{l.title}</h1>
            <p className="mt-3 text-3xl font-semibold">{formatPrice(l.price)}</p>
          </div>

          {l.status === 'rejected' && l.rejectReason && (
            <p className="alert-error">ไม่ผ่านการอนุมัติ: {l.rejectReason} (แก้ไขประกาศแล้วจะถูกส่งตรวจใหม่)</p>
          )}
          {l.status === 'pending' && (
            <p className="rounded-lg bg-peach px-3 py-2 text-sm text-peach-ink">ประกาศนี้รอผู้ดูแลตรวจ ยังไม่แสดงบนหน้าร้าน</p>
          )}

          <dl className="grid grid-cols-[110px_1fr] gap-y-3 border-y border-line py-5 text-sm">
            <dt className="text-muted">ผู้ขาย</dt>
            <dd>{l.sellerName}</dd>
            <dt className="text-muted">หมวดหมู่</dt>
            <dd>{l.categoryName}</dd>
            <dt className="text-muted">ลงประกาศ</dt>
            <dd>{formatDate(l.createdAt)}</dd>
          </dl>

          <div>
            <h2 className="eyebrow mb-2">รายละเอียด</h2>
            <p className="whitespace-pre-line text-muted">{l.description || 'ผู้ขายไม่ได้ใส่รายละเอียด'}</p>
          </div>

          <ListingActions listing={l} onChanged={load} />
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;
