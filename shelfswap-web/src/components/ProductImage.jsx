import { useState } from 'react';

// พื้นสีสำรองเวลาไม่มีรูป/รูปโหลดไม่ขึ้น สลับ 3 สีตาม id สินค้าจะได้ไม่จืดทั้งกริด
const TONES = ['bg-surface', 'bg-secondary', 'bg-mint'];

// รูปสินค้า: มีรูปก็แสดงรูป ไม่มี (หรือโหลดพัง) แสดงพื้นสีพาสเทล + ไอคอนหนังสือเส้นบาง
// className ใช้กำหนดสัดส่วน เช่น "aspect-[4/5]" หรือ "h-20 w-16"
function ProductImage({ listing, src, alt = '', className = '' }) {
  const url = src ?? listing?.imageUrl;
  const [broken, setBroken] = useState(false);
  const tone = TONES[(listing?.id ?? 0) % TONES.length];

  if (url && !broken) {
    return (
      <img
        src={url}
        alt={alt || listing?.title || ''}
        loading="lazy"
        onError={() => setBroken(true)}
        className={`rounded object-cover ${className}`}
      />
    );
  }
  return (
    <div className={`flex items-center justify-center rounded ${tone} ${className}`} role="img" aria-label={alt || listing?.title || 'ไม่มีรูปสินค้า'}>
      <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40">
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 1 4 17.5z" />
        <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 0 1.5-1.5z" />
      </svg>
    </div>
  );
}

export default ProductImage;
