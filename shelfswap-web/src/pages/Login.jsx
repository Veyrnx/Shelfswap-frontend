import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import LoginForm from '../components/LoginForm';

function Login() {
  const { login, isLoggedIn, notice } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/'; // ProtectedRoute / ปุ่มจอง ฝากไว้ว่ามาจากหน้าไหน

  if (isLoggedIn) return <Navigate to={from} replace />;

  async function handleLogin(email, password) {
    await login(email, password); // ผิดจะ throw ให้ LoginForm โชว์
    navigate(from, { replace: true });
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-1 heading text-3xl">เข้าสู่ระบบ</h1>
      <p className="mb-6 text-sm text-muted">
        ยังไม่มีบัญชี? <Link to="/register" state={location.state} className="text-ink hover:underline">สมัครสมาชิก</Link>
      </p>
      {notice && <p className="mb-4 rounded-lg bg-peach px-3 py-2 text-sm text-peach-ink">{notice}</p>}
      <div className="card p-6">
        <LoginForm onSubmit={handleLogin} />
      </div>
      <p className="mt-4 text-center text-xs text-muted">บัญชีทดลอง: mei@shelfswap.test / password123</p>
    </div>
  );
}

export default Login;
