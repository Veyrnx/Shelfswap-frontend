import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const tabs = [
  { to: '/me', label: 'ขายของฉัน', end: true },
  { to: '/me/requests', label: 'คำขอจอง' },
  { to: '/me/reservations', label: 'การจองของฉัน' },
  { to: '/me/profile', label: 'โปรไฟล์' },
];

// Member Dashboard: แท็บด้านบน + <Outlet/> (หน้าลูกมาแสดงตรงนี้)
// ProtectedRoute ครอบที่ App.jsx ครั้งเดียว ทุกแท็บจึงต้อง login
function DashboardLayout() {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="heading text-3xl">แดชบอร์ดของ {user?.displayName}</h1>
      <nav className="mt-4 flex gap-1 overflow-x-auto border-b border-line">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-4 py-2 text-sm ${isActive ? 'border-ink font-medium text-ink' : 'border-transparent text-muted hover:text-ink'}`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
      <div className="pt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
