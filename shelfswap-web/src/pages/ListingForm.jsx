import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createListing, getCategories, getListing, updateListing, uploadImage } from '../api/listings';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../components/ui/Toast';
import { ErrorState, RowsSkeleton } from '../components/ui/States';
import ProductImage from '../components/ProductImage';
import { CONDITIONS } from '../utils/format';

const EMPTY = { title: '', description: '', price: '', condition: 'good', imageUrl: '', categoryId: '' };

// ฟอร์มเดียวใช้ทั้ง "ลงประกาศใหม่" (/listings/new) และ "แก้ไข" (/listings/:id/edit) แบบ AdminMovieForm ใน moviehub
function ListingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const jobs = [getCategories().then((d) => setCategories(d.items))];
    if (isEdit) {
      jobs.push(
        getListing(id, token).then((l) => {
          if (l.sellerId !== user?.id) throw new Error('แก้ไขได้เฉพาะประกาศของตัวเอง');
          setForm({
            title: l.title,
            description: l.description,
            price: String(l.price),
            condition: l.condition,
            imageUrl: l.imageUrl,
            categoryId: String(l.categoryId),
          });
        })
      );
    }
    Promise.all(jobs)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, token, user?.id]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setError('รองรับเฉพาะไฟล์ JPG, PNG และ WEBP');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('รูปภาพต้องมีขนาดไม่เกิน 5 MB');
      e.target.value = '';
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }



  async function submit(e) {
    e.preventDefault();

    if (busy) return;

    if (form.title.trim().length < 3) {
      return setError('ชื่อสินค้าต้องยาวอย่างน้อย 3 ตัวอักษร');
    }

    if (form.price === '' || Number(form.price) < 0) {
      return setError('กรุณาใส่ราคา (0 = ให้ฟรี)');
    }

    if (!form.categoryId) {
      return setError('กรุณาเลือกหมวดหมู่');
    }

    setError('');
    setBusy(true);

    const input = {
      ...form,
      title: form.title.trim(),
      price: Number(form.price),
      categoryId: Number(form.categoryId),
    };

    try {
      // ถ้าผู้ใช้เลือกรูปใหม่ ให้อัปโหลดรูปก่อน
      if (imageFile) {
        setUploading(true);

        const result = await uploadImage(token, imageFile);

        if (!result?.url) {
          throw new Error('อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่');
        }

        input.imageUrl = result.url;
        setUploading(false);
      }

      // บันทึกประกาศด้วย API เดิม
      const saved = isEdit
        ? await updateListing(token, id, input)
        : await createListing(token, input);

      toast.success(
        saved.status === 'pending'
          ? 'บันทึกแล้ว รอผู้ดูแลอนุมัติก่อนขึ้นหน้าร้าน'
          : 'บันทึกการแก้ไขแล้ว'
      );

      navigate(`/listings/${saved.id}`);

    } catch (err) {
      setError(err.message);
      setBusy(false);
      setUploading(false);
    }
  }


  if (loading) return <div className="mx-auto max-w-2xl px-4 py-8"><RowsSkeleton rows={5} /></div>;
  if (loadError) return <div className="mx-auto max-w-2xl px-4 py-8"><ErrorState message={loadError} /></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 heading text-3xl">{isEdit ? 'แก้ไขประกาศ' : 'ลงประกาศขาย'}</h1>
      <form onSubmit={submit} noValidate className="card space-y-5 p-6">
        <div>
          <label htmlFor="title" className="label">ชื่อสินค้า *</label>
          <input id="title" maxLength={100} value={form.title} onChange={set('title')} className="input" placeholder="เช่น Thomas' Calculus 14th Edition" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="categoryId" className="label">หมวดหมู่ *</label>
            <select id="categoryId" value={form.categoryId} onChange={set('categoryId')} className="input">
              <option value="">-- เลือกหมวด --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="price" className="label">ราคา (บาท) *</label>
            <input id="price" type="number" min="0" max="1000000" value={form.price} onChange={set('price')} className="input" />
          </div>
        </div>

        <fieldset>
          <legend className="label">สภาพสินค้า *</legend>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <label
                key={c.value}
                className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm ${form.condition === c.value ? 'border-accent bg-surface text-ink' : 'border-field'}`}
              >
                <input type="radio" name="condition" value={c.value} checked={form.condition === c.value} onChange={set('condition')} className="sr-only" />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>


        <div>
          <label htmlFor="imageFile" className="label">
            รูปภาพสินค้า
          </label>

          <input
            id="imageFile"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="input"
          />

          <p className="mt-1 text-xs text-muted">
            รองรับ JPG, PNG, WEBP ขนาดไม่เกิน 5 MB
          </p>

          {(imagePreview || form.imageUrl) && (
            <ProductImage
              key={imagePreview || form.imageUrl}
              src={imagePreview || form.imageUrl}
              alt="ตัวอย่างรูปสินค้า"
              className="mt-3 h-40 w-32"
            />
          )}

          {imageFile && (
            <p className="mt-2 text-xs text-muted">
              ไฟล์ที่เลือก: {imageFile.name}
            </p>
          )}
        </div>


        <div>
          <label htmlFor="description" className="label">รายละเอียด</label>
          <textarea id="description" rows={5} maxLength={2000} value={form.description} onChange={set('description')} className="input-box" placeholder="ตำหนิ, ฉบับพิมพ์, จุดนัดรับ ฯลฯ" />
        </div>

        {!isEdit && <p className="text-sm text-peach-ink">ประกาศใหม่ต้องรอผู้ดูแลอนุมัติก่อนขึ้นหน้าร้าน</p>}
        {error && <p role="alert" className="rounded-lg bg-coral-soft px-3 py-2 text-sm text-coral-text">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-outline">ยกเลิก</button>

          <button disabled={busy} className="btn-primary">
            {uploading
              ? 'กำลังอัปโหลดรูป...'
              : busy
                ? 'กำลังบันทึก...'
                : isEdit
                  ? 'บันทึกการแก้ไข'
                  : 'ลงประกาศ'}
          </button>

        </div>
      </form>
    </div>
  );
}

export default ListingForm;
