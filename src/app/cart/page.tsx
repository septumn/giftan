'use client';

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addToCart, deleteFromCart, toggleSelect } from "@/lib/store/slices/cartSlice";
import { GiftImage } from "@/components/gift-image/GiftImage";
import Link from "next/link";
import styles from "./page.module.css";
import cardStyles from "@/components/new-gifts/NewGifts.module.css";

export default function Cart() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const totalPrice = cartItems
    .filter(item => item.selected !== false)
    .reduce((acc, item) => acc + (item.price * item.amount), 0)

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>Корзина пуста</h2>
        <p>Самое время добавить в неё что-нибудь интересное!</p>
        <Link href="/" className={styles.backBtn}>К покупкам</Link>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.title}>Корзина</h1>
      <div className={styles.cartContent}>
        <div className={styles.itemsList}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemMain}>
                <div className={styles.imageBox}>
                  <GiftImage gift={item} size={150} />
                </div>

                <div className={styles.itemInfo}>
                  <h3>{item.modelName}</h3>
                  <p>{item.price} ₽</p>
                </div>
              </div>

              <div className={styles.itemActions}>
                <div className={cardStyles.quantityControls}>
                  <button onClick={() => dispatch(deleteFromCart({ id: item.id }))} className={cardStyles.quantityBtn}>-</button>
                  <span className={cardStyles.quantityValue}>{item.amount}</span>
                  <button onClick={() => dispatch(addToCart(item))} className={cardStyles.quantityBtn}>+</button>
                </div>

                <label className={styles.miniCheckbox}>
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => dispatch(toggleSelect(item.id))}
                  />
                  <span className={styles.checkmark}></span>
                </label>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.summaryCard}>
          <h3>Итого:</h3>
          <div className={styles.summaryRow}>
            <span>Товары ({cartItems.length}):</span>
            <span>{totalPrice} ₽</span>
          </div>
          <div className={styles.totalRow}>
            <span>К оплате:</span>
            <span className={styles.totalValue}>{totalPrice} ₽</span>
          </div>
          <button className={styles.checkoutBtn}>Оформить заказ</button>
        </div>
      </div>
    </div>
  );
}
