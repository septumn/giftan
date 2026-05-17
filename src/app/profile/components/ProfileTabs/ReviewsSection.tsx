'use client'

import styles from "../../page.module.css"

const ReviewsSection = () => {
  return (
    <div className={styles.reviewsSection}>
      {[
        { name: 'Анна К.', text: 'Браслет невероятный, очень качественный. Упаковка тоже порадовала!', rating: 5, date: '12 апр 2025' },
        { name: 'Дмитрий П.', text: 'Быстрая доставка, всё как на фото. Буду заказывать ещё.', rating: 5, date: '3 апр 2025' },
        { name: 'Елена В.', text: 'Отличная работа, серьги очень красивые.', rating: 4, date: '28 мар 2025' },
      ].map((r, i) => (
        <div key={i} className={styles.reviewCard}>
          <div className={styles.reviewHeader}>
            <div className={styles.reviewAvatar}>{r.name[0]}</div>
            <div>
              <div className={styles.reviewName}>{r.name}</div>
              <div className={styles.reviewDate}>{r.date}</div>
            </div>
            <div className={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
          </div>
          <p className={styles.reviewText}>{r.text}</p>
        </div>
      ))}
    </div>
  )
}

export default ReviewsSection