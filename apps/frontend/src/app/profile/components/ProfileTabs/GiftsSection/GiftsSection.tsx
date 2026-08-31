'use client'

import AddGift from "./AddGift"
import styles from "../../../page.module.css"

const GiftsSection = (
  {
    filterStatus,
    setFilterStatus,
    statusLabel,
    filteredProducts,
    statusClass
  }
) => {
  return (
    <div className={styles.productsSection}>
      <div className={styles.productsToolbar}>
        <div className={styles.filterPills}>
          {['all', 'active', 'sold', 'hidden'].map(f => (
            <button
              key={f}
              className={`${styles.pill} ${filterStatus === f ? styles.pillActive : ''}`}
              onClick={() => setFilterStatus(f)}
            >
              {f === 'all' ? 'Все' : statusLabel[f]}
            </button>
          ))}
        </div>
        <AddGift />
      </div>

      <div className={styles.productsGrid}>
        {filteredProducts.map(p => (
          <div key={p.id} className={styles.productCard}>
            <div className={styles.productImageWrap}>
              <div className={styles.productImage}>{p.image}</div>
              <span className={`${styles.statusBadge} ${statusClass[p.status]}`}>
                {statusLabel[p.status]}
              </span>
              <div className={styles.productActions}>
                <button className={styles.actionBtn}><i className="fa-solid fa-pencil"></i></button>
                <button className={styles.actionBtn}>🗑</button>
              </div>
            </div>
            <div className={styles.productBody}>
              <span className={styles.productCategory}>{p.category}</span>
              <h3 className={styles.productName}>{p.name}</h3>
              <div className={styles.productFooter}>
                <span className={styles.productPrice}>{p.price.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GiftsSection