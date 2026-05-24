import styles from "./page.module.css"
import { db } from "@/db"
import { gifts } from "@/db/schema"
import { count, desc } from "drizzle-orm"
import GiftCard from "@/components/new-gifts/GiftCard"
import Pagination from "@/components/ui/pagination/Pagination"

export default async function NewGiftsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {

  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const itemsPerPage = 12

  const [countResult] = await db
    .select({ total: count() })
    .from(gifts)

  const totalGifts = countResult?.total || 0
  const totalPages = Math.ceil(totalGifts / itemsPerPage)

  const newGifts = await db
    .select()
    .from(gifts)
    .orderBy(desc(gifts.createdAt))
    .limit(itemsPerPage)
    .offset((currentPage - 1) * itemsPerPage)

  return (
    <section className={styles.giftsSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Новые предложения</h2>
        </div>
        <div className={styles.giftsGrid}>
          {newGifts.length > 0 ? (
            newGifts.map((newGift) => (
              <GiftCard key={newGift.id} newGift={newGift} />
            ))
          ) : (
            <p>Подарков пока нет</p>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl="/new-gifts"
        />
      </div>
    </section>
  );
}