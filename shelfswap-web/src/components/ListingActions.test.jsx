import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider, TOKEN_KEY, USER_KEY } from '../auth/AuthContext';
import ListingActions from './ListingActions';

// เทสต์ของคนที่ 2: กดปุ่มจองตอนเป็น Guest แล้วถูกพาไปหน้า Login
const listing = { id: 13, title: 'Casio fx-991EX', price: 550, status: 'available', sellerId: 2, sellerName: 'เมย์' };

// หน้า Login ปลอม โชว์ด้วยว่าจำไว้ว่ามาจากไหน (login เสร็จจะได้กลับมาถูกหน้า)
function FakeLogin() {
  const location = useLocation();
  return <h1>หน้า Login จาก {location.state?.from}</h1>;
}

function renderAt() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/listings/13']}>
        <Routes>
          <Route path="/listings/:id" element={<ListingActions listing={listing} />} />
          <Route path="/login" element={<FakeLogin />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

beforeEach(() => {
  localStorage.clear(); // AuthProvider อ่าน token จาก localStorage ตอนเริ่ม ต้องล้างทุกเทสต์
  // AuthProvider เรียก GET /api/me ตอนเริ่มถ้ามี token: ให้ fetch ค้างไว้เฉย ๆ เทสต์นี้ไม่ได้ทดสอบส่วนนั้น
  global.fetch = jest.fn(() => new Promise(() => {}));
});

test('Guest กดจอง ต้องถูกพาไปหน้า Login และจำหน้าเดิมไว้', async () => {
  const user = userEvent.setup();
  renderAt();

  await user.click(screen.getByRole('button', { name: 'จองสินค้านี้' }));

  expect(screen.getByRole('heading')).toHaveTextContent('หน้า Login จาก /listings/13');
});

test('สมาชิกที่ login แล้วกดจอง ต้องเห็นกล่องยืนยันการจอง ไม่ถูกพาไปหน้า Login', async () => {
  localStorage.setItem(TOKEN_KEY, 'fake.token');
  localStorage.setItem(USER_KEY, JSON.stringify({ id: 3, displayName: 'พลอย', role: 'member' }));
  const user = userEvent.setup();
  renderAt();

  await user.click(screen.getByRole('button', { name: 'จองสินค้านี้' }));

  expect(screen.getByRole('dialog', { name: 'ยืนยันการจอง' })).toBeInTheDocument();
});

test('เจ้าของประกาศต้องไม่เห็นปุ่มจอง แต่เห็นปุ่มจัดการแทน', () => {
  localStorage.setItem(TOKEN_KEY, 'fake.token');
  localStorage.setItem(USER_KEY, JSON.stringify({ id: 2, displayName: 'เมย์', role: 'member' }));
  renderAt();

  expect(screen.queryByRole('button', { name: 'จองสินค้านี้' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'แก้ไขประกาศ' })).toBeInTheDocument();
});
