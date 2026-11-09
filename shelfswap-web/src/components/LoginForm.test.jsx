import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

// เทสต์ของคนที่ 1: LoginForm แสดง error เมื่อกรอกไม่ครบ
test('กดเข้าสู่ระบบโดยไม่กรอกอะไร ต้องเห็น error และไม่เรียก onSubmit', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  await user.click(screen.getByRole('button', { name: 'เข้าสู่ระบบ' }));

  expect(screen.getByRole('alert')).toHaveTextContent('กรุณากรอกอีเมลและรหัสผ่าน');
  expect(onSubmit).not.toHaveBeenCalled();
});

test('กรอกแค่อีเมล ไม่กรอกรหัสผ่าน ก็ต้องเห็น error', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('อีเมล'), 'mei@shelfswap.test');
  await user.click(screen.getByRole('button', { name: 'เข้าสู่ระบบ' }));

  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

test('กรอกครบแต่ server ตอบรหัสผิด ต้องโชว์ข้อความจาก server', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn().mockRejectedValue(new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง'));
  render(<LoginForm onSubmit={onSubmit} />);

  await user.type(screen.getByLabelText('อีเมล'), 'mei@shelfswap.test');
  await user.type(screen.getByLabelText('รหัสผ่าน'), 'wrongpass');
  await user.click(screen.getByRole('button', { name: 'เข้าสู่ระบบ' }));

  expect(onSubmit).toHaveBeenCalledWith('mei@shelfswap.test', 'wrongpass');
  expect(await screen.findByRole('alert')).toHaveTextContent('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
});
