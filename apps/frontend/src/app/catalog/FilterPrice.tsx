'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function FilterPrice() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [min, setMin] = useState(searchParams.get('min') || '');
  const [max, setMax] = useState(searchParams.get('max') || '');

  useEffect(() => {
    setMin(searchParams.get('min') || '');
    setMax(searchParams.get('max') || '');
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      const currentMin = searchParams.get('min') || '';
      const currentMax = searchParams.get('max') || '';

      if (min === currentMin && max === currentMax) {
        return;
      }

      if (min) params.set('min', min); else params.delete('min');
      if (max) params.set('max', max); else params.delete('max');

      params.delete('page');

      const newQuery = params.toString();
      if (newQuery !== searchParams.toString()) {
        router.push(`${pathname}?${newQuery}`, { scroll: false });
      }
    }, 600);

    return () => clearTimeout(handler);
  }, [min, max, pathname, router, searchParams]);

  return (
    <div className={styles.filterGroup}>
      <h3 className={styles.filterTitle}>Цена, ₽</h3>
      <div className={styles.priceInputs}>
        <input
          type="number"
          placeholder="От"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="До"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />
      </div>
    </div>
  );
}