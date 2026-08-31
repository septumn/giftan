'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface Props {
  children: React.ReactNode;
}

export default function MobileFilterDrawer({ children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  return (
    <div className={styles.mobileOnly}>
      <button className={styles.openBtn} onClick={() => setIsOpen(true)}>
        <i className="fas fa-sliders-h"></i> Фильтры
      </button>

      <div
        className={`${styles.overlay} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.drawerHeader}>
          <span>Фильтры</span>
          <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles.drawerContent}>
          {children}
        </div>
      </div>
    </div>
  );
}