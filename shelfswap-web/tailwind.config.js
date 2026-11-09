/** @type {import('tailwindcss').Config} */
// ธีม "เทอร์ควอยซ์ มินิมอล" สีทั้งหมดของเว็บอยู่ที่นี่ที่เดียว อยากเปลี่ยนธีมแก้ตรงนี้พอ
// ห้ามใช้สีของ Tailwind ตรง ๆ (indigo-600, slate-500 ...) ในคอมโพเนนต์ ให้ใช้ชื่อด้านล่างแทน
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // จากเทมเพลต
        primary: '#0B3D3B',   // ปุ่มหลัก + ตัวอักษรหลัก
        accent: '#14B8A6',    // ปุ่มที่เลือกอยู่ / ป้ายติดจอง
        secondary: '#99F6E4', // ป้ายพร้อมขาย / พื้นรูป
        surface: '#E6FFFB',   // พื้นรูป / พื้นส่วนที่ต้องแยกจากพื้นหลัง
        bg: '#F8FFFE',        // พื้นหลังทั้งเว็บ
        // เพิ่มเองให้เข้าชุด
        ink: '#0B3D3B',       // ตัวอักษรหลัก (สีเดียวกับ primary)
        muted: '#3F6663',     // ตัวอักษรรอง
        mint: '#CFF5EE',      // พื้นรูปสีที่ 3
        line: '#CDEDE8',      // เส้นแบ่ง
        field: '#A7D9D1',     // ขอบช่องกรอก / ปุ่มรอง
        hover: '#0E8A7D',     // ลิงก์ตอนชี้เมาส์
        stone: { DEFAULT: '#E2E8E7', ink: '#3F4B4A' }, // ขายแล้ว
        peach: { DEFAULT: '#F6E3C8', ink: '#6B4A1A' }, // รออนุมัติ
        coral: { DEFAULT: '#E89A98', ink: '#3D1414', soft: '#FCEDEC', text: '#A8403D' }, // ลบ / ไม่ผ่าน / error
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Thai"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif Thai"', 'serif'],
      },
    },
  },
  plugins: [],
};
