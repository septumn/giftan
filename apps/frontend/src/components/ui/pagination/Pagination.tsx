'use client';

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

const Pagination = ({ currentPage, totalPages, baseUrl }: PaginationProps) => {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) => page >= currentPage - 3 && page <= currentPage + 3
  );

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className={styles.pagination}>
      <Link
        href={createPageUrl(Math.max(1, currentPage - 1))}
        className={`${styles.pageLink} ${currentPage === 1 ? styles.disabled : ""}`}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`${styles.pageLink} ${currentPage === page ? styles.activePage : ""
            }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={createPageUrl(Math.min(totalPages, currentPage + 1))}
        className={`${styles.pageLink} ${currentPage === totalPages ? styles.disabled : ""
          }`}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </Link>
    </div>
  );
}

export default Pagination;