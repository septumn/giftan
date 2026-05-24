'use client';

import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "./NewGifts.module.css";
import { Gift } from "@prisma/client"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { addToCart, deleteFromCart } from "@/lib/store/slices/cartSlice";

interface GiftCardProps {
  newGift: Gift;
}

const GiftCard = ({ newGift }: GiftCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const symbols = useMemo(() => Array(20).fill(0), []);

  const dispatch = useAppDispatch();

  const cartItem = useAppSelector(state =>
    state.cart.items.find(item => item.id === newGift.id)
  );

  const onTheCart = !!cartItem;
  const currentAmount = cartItem ? cartItem.amount : 0;

  const getDynamicColor = (value) => {
    const val = Math.max(1, Math.min(10, value));
    const hue = (val - 1) * (120 / 9);

    return `hsl(${hue}, 80%, 45%)`;
  };


  return (
    <div className={styles.giftCard}>
      <div className={styles.giftImageWrapper}>
        <Image src={`/gift/backdrops/${newGift.backdrop}/${newGift.backdrop}.svg`} alt={newGift.backdrop} fill className={styles.backdropImage} />
        {symbols && symbols.map((_, index) => (
          <Image
            key={index}
            src={`/gift/symbols/${newGift.symbol}/${newGift.symbol}.webp`}
            alt={newGift.symbol}
            width={8}
            height={8}
            className={`${styles.symbolImage} ${styles[`symbol${index + 1}`]}`}
          />
        ))}
        <Image src={`/gift/collections/${newGift.collection}/${newGift.modelName}.webp`} alt={newGift.modelName} width={300} height={300} className={styles.modelImage} />
        <span className={styles.giftBadge}>Хит</span>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`${styles.addToFavorites}`}
          style={isFavorite ? { color: 'red' } : {}}
        >
          <i className={`fa-regular fa-heart ${isFavorite ? 'fa-solid' : ''}`}></i>
        </button>
      </div>
      <div className={styles.giftInfo}>
        <div className={styles.giftType}>{newGift.collection}</div>
        <h3 className={styles.giftName}>{newGift.modelName}</h3>
        <div className={styles.giftDetails}>
          <span className={styles.detailItem}><i className="fas fa-shield-alt"></i>{newGift.symbol}</span>
          <span className={styles.detailItem}><i className="fas fa-palette"></i>{newGift.backdrop}</span>
        </div>
        <p className={styles.giftDescription}>{newGift.description}</p>
        <div className={styles.giftFooter}>
          <div className={styles.priceBlock}>
            <div className={styles.seller}>
              <div className={styles.sellerLink}>
                <span>Продавец:</span>
                <span className={styles.sellerName}>Test Seller</span>
              </div>
              <div className={styles.sellerGrade}>
                <span>Оценка:</span>
                <span className={styles.sellerRating} style={{ color: getDynamicColor(6.9) }}>6.9</span>
              </div>
            </div>
            <span className={styles.priceLabel}>Цена:</span>
            <div className={styles.purchaseInfo}>
              <span className={styles.priceValue}>{newGift.price} ₽</span>
              <div className={styles.stockInfo}>
                <i className="fas fa-box"></i> #{newGift.collectibleNumber}
              </div>
            </div>
          </div>
        </div>
        {onTheCart ? (
          <div className={styles.quantityControls}>
            <button onClick={() => dispatch(deleteFromCart({ id: newGift.id }))} className={styles.quantityBtn}>-</button>
            <span className={styles.quantityValue}>{currentAmount}</span>
            <button onClick={() => dispatch(addToCart({
              ...newGift,
              createdAt: newGift.createdAt.toString()
            }))} className={styles.quantityBtn}>+</button>
          </div>
        ) : (
          <button onClick={() => dispatch(addToCart({
            ...newGift,
            createdAt: newGift.createdAt.toString(),
          }))} className={styles.addToCartBtn}>
            <i className="fas fa-shopping-cart"></i> В корзину
          </button>
        )}
      </div>
    </div>
  );
}

export default GiftCard;