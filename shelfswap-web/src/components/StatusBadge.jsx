// ป้ายสถานะ ใช้ทั้งกับประกาศ (kind="listing") และการจอง (kind="reservation")
// สีมาจากธีมใน tailwind.config.js ทุกคู่ตัวอักษรเข้มบนพื้นอ่อน อ่านได้ชัด
const LISTING = {
  pending: ['รออนุมัติ', 'bg-peach text-peach-ink'],
  available: ['พร้อมขาย', 'bg-secondary text-primary'],
  reserved: ['ติดจอง', 'bg-accent text-primary'],
  sold: ['ขายแล้ว', 'bg-stone text-stone-ink'],
  rejected: ['ไม่ผ่านการอนุมัติ', 'bg-coral text-coral-ink'],
};

const RESERVATION = {
  pending: ['รอผู้ขายตอบ', 'bg-peach text-peach-ink'],
  accepted: ['ยืนยันแล้ว', 'bg-secondary text-primary'],
  rejected: ['ถูกปฏิเสธ', 'bg-coral text-coral-ink'],
  cancelled: ['ยกเลิกแล้ว', 'bg-stone text-stone-ink'],
  completed: ['ซื้อขายสำเร็จ', 'bg-accent text-primary'],
};

function StatusBadge({ status, kind = 'listing' }) {
  const map = kind === 'reservation' ? RESERVATION : LISTING;
  const [label, cls] = map[status] ?? [status, 'bg-stone text-stone-ink'];
  return <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${cls}`}>{label}</span>;
}

export default StatusBadge;
