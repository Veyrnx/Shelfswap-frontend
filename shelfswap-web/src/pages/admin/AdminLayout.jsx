import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'ภาพรวม', end: true },
  { to: '/admin/categories', label: 'หมวดหมู่' },
  { to: '/admin/users', label: 'ผู้ใช้' },
];

// Admin Panel (คนที่ 1): Sidebar + <Outlet/> หน้าลูกทุกหน้าถูกครอบด้วย RequireRole ที่ App.jsx
function AdminLayout() {
  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[200px_1fr]">
      <aside>
        <p className="eyebrow mb-3 px-3">หลังบ้าน</p>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-2 text-sm ${isActive ? 'bg-accent text-primary' : 'text-ink hover:bg-surface'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
}

export default AdminLayout;
