import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { logout as apiLogout } from '../api/auth';

// ลิงก์ที่อยู่หน้านั้นอยู่ มีเส้นใต้ ที่เหลือเป็นสีรอง
const linkClass = ({ isActive }) =>
  `py-1 text-sm transition ${isActive ? 'border-b-[1.5px] border-ink text-ink' : 'text-muted hover:text-hover'}`;

// เมนูเปลี่ยนตามสิทธิ์: Guest เห็นเข้าสู่ระบบ/สมัคร, Member เห็นลงประกาศ+แดชบอร์ด, Admin เห็นหลังบ้านเพิ่ม
function Navbar() {
  const { isLoggedIn, isAdmin, user, token, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const close = () => setOpen(false);

  function handleLogout() {
    apiLogout(token).catch(() => {}); // JWT ลบที่ server ไม่ได้ เรียกไว้ให้ครบ flow ไม่ต้องรอผล
    logout();
    close();
    navigate('/');
  }

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={close}>หน้าร้าน</NavLink>
      {isLoggedIn && (
        <>
          <NavLink to="/listings/new" className={linkClass} onClick={close}>ลงประกาศ</NavLink>
          <NavLink to="/me" className={linkClass} onClick={close}>แดชบอร์ด</NavLink>
        </>
      )}
      {isAdmin && <NavLink to="/admin" className={linkClass} onClick={close}>หลังบ้าน</NavLink>}
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center gap-8 px-5 py-3 sm:px-8">
        <Link to="/" className="font-serif text-xl font-semibold text-ink">ShelfSwap</Link>
        <div className="hidden flex-1 items-center gap-6 md:flex">{links}</div>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-muted">
                {user?.displayName}
                {isAdmin && <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs text-primary">admin</span>}
              </span>
              <button onClick={handleLogout} className="btn-outline btn-sm">ออกจากระบบ</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm text-ink hover:text-hover">เข้าสู่ระบบ</Link>
              <Link to="/register" className="btn-primary btn-sm">สมัครสมาชิก</Link>
            </>
          )}
        </div>

        <button
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface md:hidden"
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="flex flex-col items-start gap-3 border-t border-line px-5 py-4 md:hidden">
          {links}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn-outline mt-2 w-full">ออกจากระบบ ({user?.displayName})</button>
          ) : (
            <div className="mt-2 flex w-full gap-2">
              <Link to="/login" className="btn-outline flex-1" onClick={close}>เข้าสู่ระบบ</Link>
              <Link to="/register" className="btn-primary flex-1" onClick={close}>สมัครสมาชิก</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;
