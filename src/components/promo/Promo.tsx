import Link from 'next/link'
import styles from './Promo.module.css'

const Promo = () => {
  return (
    <section className={styles.promoSection}>
      <div className={styles.container}>
        <div className={styles.promoCard}>
          <div className={styles.promoContent}>
            <h2 className={styles.promoTitle}>Сделайте подарок себе и близким</h2>
            <p className={styles.promoSubtitle}>Покупайте и продавайте по лучшим ценам</p>
            <Link href="/catalog" className={styles.promoBtn}>
              Смотреть каталог
              <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <div className={styles.promoDecoration}>
            <i className="fas fa-gift"></i>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Promo