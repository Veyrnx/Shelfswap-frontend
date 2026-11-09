import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import ProductImage from './ProductImage';
import { conditionLabel, formatPrice } from '../utils/format';

// การ์ดสินค้า 1 ใบในกริดหน้าร้าน (มินิมอล: ไม่มีกรอบ ไม่มีเงา รูปแนวตั้ง 4:5)
// ป้ายสถานะโชว์เฉพาะตอนไม่ใช่ available (หน้าร้านส่วนใหญ่พร้อมขาย โชว์ทุกใบจะรก)
function ListingCard({ listing }) {
  const { id, title, price, condition, status, categoryName, sellerName } = listing;

  return (
    <Link to={`/listings/${id}`} className="group flex flex-col gap-3">
      <div className="relative">
        <ProductImage listing={listing} className="aspect-[4/5] w-full transition group-hover:opacity-90" />
        {status !== 'available' && (
          <div className="absolute left-3 top-3">
            <StatusBadge status={status} />
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-muted">{categoryName}</p>
        <h3 className="mt-0.5 line-clamp-2 leading-snug group-hover:text-hover">{title}</h3>
        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <p className="text-base font-semibold">{formatPrice(price)}</p>
          <p className="text-xs text-muted">{conditionLabel(condition)}</p>
        </div>
        <p className="mt-0.5 text-xs text-muted">โดย {sellerName}</p>
      </div>
    </Link>
  );
}

export default ListingCard;
