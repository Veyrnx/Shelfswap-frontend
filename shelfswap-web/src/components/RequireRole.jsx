import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// ครอบทั้งกิ่ง /admin ครั้งเดียว หน้าลูกทุกหน้าได้รับการป้องกันหมด
// (นี่คือการ "ซ่อนหน้า" ฝั่ง React การป้องกันจริงคือ admin(...) ใน main.go)
function RequireRole({ role, children }) {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (user?.role !== role) {
    return (
      <div className="px-4 py-24 text-center">
        <p className="text-5xl font-semibold text-field">403</p>
        <p className="mt-2 text-muted">หน้านี้สำหรับ {role} เท่านั้น</p>
        <Link to="/" className="mt-4 inline-block text-sm text-ink hover:underline">
          กลับหน้าแรก
        </Link>
      </div>
    );
  }
  return children;
}

export default RequireRole;
