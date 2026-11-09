import { useEffect, useState } from 'react';

// ส่วนหัวหน้าแรก + ช่องค้นหาแบบเส้นใต้ กด Enter แล้วส่งคำค้นให้ Home ไปใส่ใน URL (?q=)
function Hero({ initialQuery = '', onSearch }) {
  const [q, setQ] = useState(initialQuery);
  useEffect(() => setQ(initialQuery), [initialQuery]); // กดย้อนกลับแล้ว URL เปลี่ยน ช่องค้นหาต้องตาม

  function submit(e) {
    e.preventDefault();
    onSearch(q.trim());
  }

  return (
    <section className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8 px-5 pb-12 pt-14 sm:px-8 sm:pt-20">
      <div className="max-w-xl">
        <p className="eyebrow mb-3">มือสอง · จากรุ่นพี่ถึงรุ่นน้อง</p>
        <h1 className="heading text-3xl leading-snug sm:text-[44px] sm:leading-tight">
          หนังสือและอุปกรณ์การเรียน ที่ยังมีเรื่องให้เล่าต่อ
        </h1>
      </div>
      <form onSubmit={submit} role="search" className="flex w-full max-w-md items-center gap-3 border-b-[1.5px] border-ink pb-2">
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="shrink-0 text-muted">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ค้นหา Calculus, เครื่องคิดเลข, ชุดแล็บ"
          aria-label="ค้นหาสินค้า"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-base text-ink outline-none placeholder:text-muted/70"
        />
        <button className="shrink-0 py-2 text-sm font-medium text-ink hover:text-hover">ค้นหา →</button>
      </form>
    </section>
  );
}

export default Hero;
