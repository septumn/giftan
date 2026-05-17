'use client';

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "./page.module.css";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSort = searchParams.get('sort') || "new";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <select
      className={styles.sortSelect}
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
    >
      <option value="new">Сначала новые</option>
      <option value="price_asc">Сначала дешевле</option>
      <option value="price_desc">Сначала дороже</option>
    </select>
  );
}