import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ListingCard from './ListingCard';

// เทสต์ของคนที่ 2: ListingCard แสดงป้ายสถานะถูก
const base = {
  id: 13,
  title: 'เครื่องคิดเลข Casio fx-991EX',
  price: 550,
  condition: 'like_new',
  imageUrl: '',
  categoryName: 'เครื่องคิดเลข',
  sellerName: 'เมย์',
};

function renderCard(listing) {
  return render(
    <MemoryRouter>
      <ListingCard listing={listing} />
    </MemoryRouter>
  );
}

test.each([
  ['reserved', 'ติดจอง'],
  ['sold', 'ขายแล้ว'],
  ['pending', 'รออนุมัติ'],
])('สถานะ %s ต้องโชว์ป้าย "%s"', (status, label) => {
  renderCard({ ...base, status });
  expect(screen.getByText(label)).toBeInTheDocument();
});

test('ของพร้อมขายไม่ต้องมีป้าย แต่ต้องเห็นชื่อ ราคา สภาพ และลิงก์ไปหน้า Detail', () => {
  renderCard({ ...base, status: 'available' });

  expect(screen.queryByText('พร้อมขาย')).not.toBeInTheDocument();
  expect(screen.getByText('เครื่องคิดเลข Casio fx-991EX')).toBeInTheDocument();
  expect(screen.getByText(/550/)).toBeInTheDocument();
  expect(screen.getByText('เหมือนใหม่')).toBeInTheDocument();
  expect(screen.getByRole('link')).toHaveAttribute('href', '/listings/13');
});
