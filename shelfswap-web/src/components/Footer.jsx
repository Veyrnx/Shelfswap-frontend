
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-20 bg-[#103F3B] text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2">

          {/* ส่วนแนะนำเว็บไซต์ */}
          <div>
            <h2 className="font-serif text-2xl font-bold">
              ShelfSwap
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-7 text-[#C8DFD9]">
              พื้นที่ซื้อขายและส่งต่อหนังสือเรียน
              อุปกรณ์การเรียน และของใช้สำหรับนักศึกษา
              ให้สิ่งของที่ไม่ได้ใช้กลับมามีคุณค่าอีกครั้ง
            </p>
          </div>

          {/* เมนูเว็บไซต์ */}
          <div className="sm:justify-self-end">
            <h3 className="mb-4 text-base font-semibold">
              เมนูเว็บไซต์
            </h3>

            <div className="flex flex-col gap-3 text-sm text-[#C8DFD9]">
              <Link
                to="/"
                className="transition hover:text-white"
              >
                หน้าหลัก
              </Link>

              <Link
                to="/listings/new"
                className="transition hover:text-white"
              >
                ลงประกาศขาย
              </Link>

              <Link
                to="/me"
                className="transition hover:text-white"
              >
                แดชบอร์ด
              </Link>
            </div>
          </div>
        </div>

        {/* เส้นแบ่ง */}
        <div className="my-8 border-t border-white/20" />

        {/* ส่วนล่าง */}
        <div className="flex flex-col gap-3 text-xs text-[#C8DFD9] sm:flex-row sm:items-center sm:justify-between">
          <span>
            © 2026 ShelfSwap. All rights reserved.
          </span>

          <span>
            Give your books a second life ♡
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
