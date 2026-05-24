'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './Header.module.css';
import { useState, useEffect } from 'react';

const SearchBlock = () => {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');

  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSubmit = (e) => {
    const params = new URLSearchParams(searchParams.toString());

    e.preventDefault();

    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }

    params.delete('page');

    if (!pathname.startsWith('/catalog')) {
      router.push(`/catalog?${params.toString()}`);
    } else {
      router.push(`?${params.toString()}`);
    }
  }

  const clearInput = () => {
    const params = new URLSearchParams(searchParams.toString());

    setQuery("");
    params.delete('q');
    router.push(`?${params.toString()}`);
  }

  return (
    <div className={styles.searchBox}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Поиск подарков..."
          id="searchInput"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query &&
          <button type="button" onClick={clearInput} className="text-black px-5 hover:text-red-400 hover:cursor-pointer">
            <i className="fa-solid fa-xmark"></i>
          </button>
        }
        <button type="submit" className={styles.searchButton}>
          <i className="fas fa-search"></i>
          <span>Найти</span>
        </button>
      </form>

      <div className={styles.searchResults} id="searchResults"></div>
    </div>
  );
}

export default SearchBlock;