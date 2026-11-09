import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// ครอบหน้าที่ต้อง login: ยังไม่ login ส่งไป /login แล้วจำไว้ว่ามาจากไหน login เสร็จจะได้กลับมาที่เดิม
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}

export default ProtectedRoute;
