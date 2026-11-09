import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterSidebar from './FilterSidebar';

// เทสต์ของคนที่ 1: FilterSidebar ต้องส่งค่าตัวกรองออกไปถูกต้อง
const categories = [
  { id: 1, name: 'หนังสือเรียน', listingCount: 5 },
  { id: 3, name: 'เครื่องคิดเลข', listingCount: 2 },
];

test('เลือกหมวด สภาพ และช่วงราคา แล้วกดใช้ตัวกรอง ต้องส่งค่าที่เลือกออกไปครั้งเดียว', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(<FilterSidebar categories={categories} onChange={onChange} />);

  await user.click(screen.getByLabelText(/เครื่องคิดเลข/));
  await user.click(screen.getByLabelText('เหมือนใหม่'));
  await user.type(screen.getByLabelText('ราคาต่ำสุด'), '100');
  await user.type(screen.getByLabelText('ราคาสูงสุด'), '600');

  expect(onChange).not.toHaveBeenCalled(); // ยังไม่กดปุ่ม ต้องยังไม่ยิง

  await user.click(screen.getByRole('button', { name: 'ใช้ตัวกรอง' }));

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ category: '3', condition: 'like_new', minPrice: '100', maxPrice: '600' });
});

test('ราคาต่ำสุดมากกว่าสูงสุด ต้องโชว์ error และไม่ส่งค่าออกไป', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(<FilterSidebar categories={categories} onChange={onChange} />);

  await user.type(screen.getByLabelText('ราคาต่ำสุด'), '500');
  await user.type(screen.getByLabelText('ราคาสูงสุด'), '100');
  await user.click(screen.getByRole('button', { name: 'ใช้ตัวกรอง' }));

  expect(screen.getByRole('alert')).toHaveTextContent('ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด');
  expect(onChange).not.toHaveBeenCalled();
});

test('กดล้าง ต้องส่งตัวกรองว่างออกไป', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(<FilterSidebar categories={categories} value={{ category: '1', condition: 'good', minPrice: '', maxPrice: '' }} onChange={onChange} />);

  await user.click(screen.getByRole('button', { name: 'ล้าง' }));

  expect(onChange).toHaveBeenCalledWith({ category: '', condition: '', minPrice: '', maxPrice: '' });
});
