import GiftCard from "@/components/new-gifts/GiftCard"
import styles from "./page.module.css"
import { db } from '@/db'
import { gifts as giftsTable } from '@/db/schema'
import { and, or, gte, lte, ilike, sql, asc, desc, count } from 'drizzle-orm'
import Categories from './Categories'
import FilterPrice from "./FilterPrice"
import Pagination from "@/components/ui/pagination/Pagination"
import MobileFilterDrawer from "./MobileFilterDrawer"
import SortSelect from "./SortSelect"
import CustomSelect from "./CustomSelect"

export default async function Catalog({
  searchParams
}: {
  searchParams: Promise<{
    min?: string,
    max?: string,
    page?: string,
    category?: string,
    sort?: string,
    q?: string,
    collection?: string,
    model?: string,
    symbol?: string,
    backdrop?: string
  }>
}) {
  const params = await searchParams

  const search = params.q

  const { collection, model, symbol, backdrop } = params

  const min = params.min ? Number(params.min) : 0
  const max = params.max ? Number(params.max) : 999999999

  const selectedCategory = params.category

  const sort = params.sort || "new"

  let orderByCondition = desc(giftsTable.createdAt)

  if (sort === 'price_asc') {
    orderByCondition = asc(giftsTable.price)
  } else if (sort === 'price_desc') {
    orderByCondition = desc(giftsTable.price)
  }

  const currentPage = Number(params.page) || 1
  const itemsPerPage = 16

  const conditions = [
    gte(giftsTable.price, min),
    lte(giftsTable.price, max)
  ]

  if (collection) conditions.push(ilike(giftsTable.collection, `%${collection}%`))
  if (model) conditions.push(ilike(giftsTable.modelName, `%${model}%`))
  if (symbol) conditions.push(ilike(giftsTable.symbol, `%${symbol}%`))
  if (backdrop) conditions.push(ilike(giftsTable.backdrop, `%${backdrop}%`))

  if (search) {
    conditions.push(
      or(
        ilike(giftsTable.collection, `%${search}%`),
        ilike(giftsTable.modelName, `%${search}%`),
        ilike(giftsTable.symbol, `%${search}%`),
        ilike(giftsTable.backdrop, `%${search}%`),
        ilike(giftsTable.description, `%${search}%`)
      )!
    )
  }

  if (selectedCategory && selectedCategory !== 'all') {
    conditions.push(sql`${giftsTable.categories} @> ARRAY[${selectedCategory}]::text[]`)
  }

  const whereClause = and(...conditions)

  const [countResult] = await db
    .select({ total: count() })
    .from(giftsTable)
    .where(whereClause)

  const totalGifts = countResult?.total || 0
  const totalPages = Math.ceil(totalGifts / itemsPerPage)

  const gifts = await db
    .select()
    .from(giftsTable)
    .where(whereClause)
    .orderBy(orderByCondition)
    .limit(itemsPerPage)
    .offset((currentPage - 1) * itemsPerPage)

  return (
    <div className={styles.catalogWrapper}>
      <aside className={styles.sidebar}>
        <Categories />
        <CustomSelect />
        <FilterPrice />
      </aside>

      <main className={styles.mainContent}>
        <MobileFilterDrawer>
          <Categories />
          <FilterPrice />
        </MobileFilterDrawer>

        <div className={styles.sortBar}>
          <span className={styles.countInfo}>Найдено: {totalGifts} товаров</span>
          <SortSelect />
        </div>

        <div className={styles.giftsGrid}>
          {gifts.map(gift => (
            <GiftCard key={gift.id} newGift={gift} />
          ))}
        </div>
        <div className={styles.paginationWrapper}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/catalog"
          />
        </div>
      </main>
    </div>
  )
}