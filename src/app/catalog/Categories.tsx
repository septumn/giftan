'use client';

import styles from "./page.module.css";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const categories = [
  { name: "Все", slug: "all" },
  { name: "Новогодние", slug: "newYear" },
  { name: "День Рождения", slug: "birthday" },
  { name: "Девушке", slug: "girl" },
  { name: "Парню", slug: "boy" }
];

const Categories = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSlug = searchParams.get('category') || 'all';

  const onSelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (slug === 'all') params.delete('category');
    else params.set('category', slug);

    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.filterGroup}>
      <h3 className={styles.filterTitle}>Категории</h3>
      <ul className={styles.categoryList}>
        {categories.map(cat => (
          <li
            key={cat.slug}
            className={`${styles.categoryItem} ${currentSlug === cat.slug ? styles.active : ''}`}
            onClick={() => onSelect(cat.slug)}
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;