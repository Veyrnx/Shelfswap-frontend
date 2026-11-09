import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="px-4 py-24 text-center">
      <p className="text-6xl font-semibold text-field">404</p>
      <p className="mt-2 text-muted">ไม่พบหน้าที่คุณต้องการ</p>
      <Link to="/" className="btn-primary mt-6">กลับหน้าร้าน</Link>
    </div>
  );
}

export default NotFound;
