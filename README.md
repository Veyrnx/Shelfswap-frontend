# ShelfSwap

ตลาดซื้อขายหนังสือและอุปกรณ์การเรียนมือสอง: React (CRA + Tailwind) → Go (net/http + pgx) → PostgreSQL (Supabase)

```
shelfswap-api/   Go backend   -> deploy บน Render
shelfswap-web/   React        -> deploy บน Vercel
```

## รันในเครื่อง

**1. ฐานข้อมูล** (เลือกอย่างใดอย่างหนึ่ง)

- Docker: `cd shelfswap-api && docker compose up -d` แล้วรัน
  `docker compose exec -T db psql -U postgres -d shelfswap < schema.sql` และ `... < seed.sql`
- Supabase: SQL Editor → วาง `schema.sql` → Run → วาง `seed.sql` → Run

**2. Go API** (พอร์ต 8080)

```bash
cd shelfswap-api
cp .env.example .env          # ใส่ DATABASE_URL และ JWT_SECRET (openssl rand -hex 32)
go mod tidy                   # ครั้งแรก: ดาวน์โหลด library + สร้าง go.sum (commit go.sum ด้วย ไม่งั้น Render build ไม่ผ่าน)
go run .
go test ./auth -count=1       # เทสต์ตั๋วปลอม 6 แบบ
```

**3. React** (พอร์ต 3000, CRA proxy `/api` ไป 8080 ให้)

```bash
cd shelfswap-web
npm install
npm start
npm test                      # unit test 4 ไฟล์
```

บัญชีทดลองทุกบัญชีใช้รหัส `password123`: `admin@` `mei@` `ploy@` `ton@` `fah@` `banned@` + `shelfswap.test`

## Deploy

| ที่ | ตั้งค่า |
| --- | --- |
| Supabase | Project Settings → Database → Connection string → **Session pooler** (Render ใช้ IPv4 ต่อ direct connection ไม่ได้) |
| Render (Web Service, Go) | Root Directory `shelfswap-api` · Build `go build -o app .` · Start `./app` · Env: `DATABASE_URL`, `JWT_SECRET`, `ALLOWED_ORIGINS=https://<ชื่อ>.vercel.app` · Health Check Path `/api/health` |
| Vercel | Root Directory `shelfswap-web` · Env: `REACT_APP_API_URL=https://<ชื่อ>.onrender.com` (แก้แล้วต้อง Redeploy) |

ก่อนอัดคลิป เปิด `https://<ชื่อ>.onrender.com/api/health` ทิ้งไว้ก่อน เพราะ Render แบบฟรีหลับเมื่อไม่มีคนใช้

## API

| Method & Path | สิทธิ์ | คนที่ |
| --- | --- | --- |
| POST /api/auth/register · /login · /logout | Guest | 1 |
| GET · PUT /api/me · PUT /api/me/password | Member | 1 |
| GET /api/categories · /api/listings?q=&category=&condition=&minPrice=&maxPrice=&sort=&page= | Guest | 1 |
| GET /api/listings/{id} | Guest (pending/rejected เห็นเฉพาะเจ้าของ+admin) | 1 |
| POST /api/listings · PUT/DELETE /api/listings/{id} · POST /api/listings/{id}/sold · GET /api/me/listings | Member (เจ้าของ) | 2 |
| POST /api/listings/{id}/reserve · PATCH /api/reservations/{id} · GET /api/me/reservations · /api/me/requests | Member | 2 |
| GET /api/admin/users · PUT /api/admin/users/{id}/ban · POST/PUT/DELETE /api/admin/categories | Admin | 1 |
| GET /api/admin/stats · GET /api/admin/listings?status= · PATCH /api/admin/listings/{id} | Admin | 2 |

error ทุกตัวหน้าตาเดียวกัน: `{"error": {"code": "NOT_AVAILABLE", "message": "..."}}` (ตารางสถานะอยู่บนสุดของ `handler/handler.go`)

## สถานะ

```
ประกาศ:  pending --admin อนุมัติ--> available --มีคนจอง--> reserved --ผู้ขายกดขายแล้ว--> sold
         pending --admin ไม่อนุมัติ--> rejected --ผู้ขายแก้ไข--> pending
         reserved --ผู้ขายปฏิเสธ / ผู้ซื้อยกเลิก--> available
การจอง:  pending --> accepted --> completed  |  pending --> rejected / cancelled
```
