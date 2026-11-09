import { Link } from 'react-router-dom';
import StatusBadge from '../../components/StatusBadge';
import ProductImage from '../../components/ProductImage';
import { formatDate, formatPrice } from '../../utils/format';

// การ์ดการจอง 1 รายการ ใช้ทั้งแท็บ "การจองของฉัน" (viewer=buyer) และ "คำขอจอง" (viewer=seller)
// children = ปุ่มที่แต่ละแท็บใส่เข้ามาเอง
function ReservationCard({ r, viewer, children }) {
  const other = viewer === 'buyer' ? { role: 'ผู้ขาย', name: r.sellerName, phone: r.sellerPhone } : { role: 'ผู้จอง', name: r.buyerName, phone: r.buyerPhone };

  return (
    <div className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
      <ProductImage listing={{ id: r.listingId, title: r.listingTitle }} src={r.listingImage} className="h-24 w-20 shrink-0" />
      <div className="min-w-0 flex-1 text-sm">
        <StatusBadge kind="reservation" status={r.status} />
        <Link to={`/listings/${r.listingId}`} className="mt-1 block truncate text-base font-medium hover:text-hover">
          {r.listingTitle}
        </Link>
        <p className="text-muted">
          {formatPrice(r.listingPrice)} · {other.role} {other.name} · {formatDate(r.createdAt)}
        </p>
        {r.message && <p className="mt-1 rounded bg-surface px-2 py-1 text-ink">“{r.message}”</p>}
        {other.phone && (
          <p className="mt-1 font-medium text-ink">ติดต่อ{other.role}: {other.phone}</p>
        )}
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  );
}

export default ReservationCard;
