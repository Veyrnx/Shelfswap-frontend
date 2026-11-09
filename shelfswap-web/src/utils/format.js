// ค่าคงที่และตัวจัดรูปแบบที่ใช้หลายหน้า

export const CONDITIONS = [
  { value: 'new', label: 'ของใหม่' },
  { value: 'like_new', label: 'เหมือนใหม่' },
  { value: 'good', label: 'สภาพดี' },
  { value: 'fair', label: 'พอใช้' },
];

export const conditionLabel = (value) => CONDITIONS.find((c) => c.value === value)?.label ?? value;

export const SORTS = [
  { value: 'newest', label: 'ล่าสุด' },
  { value: 'price_asc', label: 'ราคาต่ำ → สูง' },
  { value: 'price_desc', label: 'ราคาสูง → ต่ำ' },
  { value: 'oldest', label: 'เก่าสุด' },
];

const thb = new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 });

export const formatPrice = (n) => (n === 0 ? 'ให้ฟรี' : thb.format(n));

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
