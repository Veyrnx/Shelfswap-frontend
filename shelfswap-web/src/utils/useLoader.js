import { useCallback, useEffect, useState } from 'react';

// hook เล็ก ๆ ที่ทุกแท็บใน Dashboard/Admin ใช้: โหลดข้อมูล + เก็บสถานะ loading/error + reload
// fetcher ต้องคืน Promise เช่น () => myListings(token)
export function useLoader(fetcher, deps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(fetcher, deps);

  const reload = useCallback(() => {
    setLoading(true);
    setError('');
    load()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [load]);

  useEffect(reload, [reload]);

  return { data, loading, error, reload, setData };
}
