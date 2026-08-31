'use client';

import Link from "next/link";
import styles from './Header.module.css';
import { useAppSelector } from "@/lib/store/hooks";

const HeaderActionsBlock = ({}) => {
  const cartItemsCount = useAppSelector((state) => state.cart.items.length);

  return (
    <div className={styles.headerActions}>
      <Link href="#" className={styles.actionBtn}>
        <i className="far fa-heart"></i>
        <span>Избранное</span>
      </Link>
      <Link href="/cart" className={styles.actionBtn}>
        <i className="fas fa-shopping-cart"></i>
        {cartItemsCount !== 0 ? <span className={styles.badge}>{cartItemsCount}</span> : ''}
        <span>Корзина</span>
      </Link>
      <Link href="/auth" className={styles.actionBtn}>
        <i className="fa-solid fa-key"></i>
        <span>Авторизация</span>
      </Link>
      <Link href="https://t.me/gifton_bot" target="_blank" className={styles.telegramBtn}>
        <i className="fab fa-telegram-plane"></i>
        <span>Telegram</span>
      </Link>
    </div>
  );
}

export default HeaderActionsBlock;