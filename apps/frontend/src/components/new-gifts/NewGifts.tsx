import styles from "./NewGifts.module.css"
import { db } from "@/db"
import { gifts } from "@/db/schema"
import { desc } from "drizzle-orm"
import GiftCard from "./GiftCard"

const NewGifts = async () => {
  const newGifts = await db
    .select()
    .from(gifts)
    .orderBy(desc(gifts.createdAt))

  return (
    <section className={styles.giftsSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Новые предложения</h2>
          <a href="/new-gifts" className={styles.viewAllLink}>Смотреть все <i className="fas fa-arrow-right"></i></a>
        </div>
        <div className={styles.giftsGrid}>
          {newGifts.length > 0 && newGifts.slice(0, 8).map((newGift) => (
            <GiftCard
              key={newGift.id}
              newGift={newGift}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewGifts