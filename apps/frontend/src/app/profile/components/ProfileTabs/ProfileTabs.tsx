'use client'

import styles from "../../page.module.css"
import { useState } from "react"
import TabSection from "./TabsSection";
import GiftsSection from "./GiftsSection/GiftsSection";
import ReviewsSection from "./ReviewsSection";

const mockProducts = [
  { id: 1, name: 'Серебряный браслет', price: 4200, category: 'Украшения', status: 'active', image: '💎' },
  { id: 2, name: 'Кожаный кошелёк', price: 3800, category: 'Аксессуары', status: 'active', image: '👜' },
  { id: 3, name: 'Хрустальная ваза', price: 6500, category: 'Декор', status: 'sold', image: '🏺' },
  { id: 4, name: 'Шёлковый шарф', price: 2900, category: 'Одежда', status: 'active', image: '🧣' },
  { id: 5, name: 'Деревянная шкатулка', price: 1800, category: 'Декор', status: 'hidden', image: '📦' },
  { id: 6, name: 'Янтарные серьги', price: 5100, category: 'Украшения', status: 'active', image: '✨' },
];

const ProfileTabs = () => {
  const [activeTab, setActiveTab] = useState('products')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredProducts = mockProducts.filter(p =>
    filterStatus === 'all' ? true : p.status === filterStatus
  );

  const statusLabel = { active: 'Активен', sold: 'Продан', hidden: 'Скрыт' }
  const statusClass = { active: styles.statusActive, sold: styles.statusSold, hidden: styles.statusHidden }

  return (
    <>
      <TabSection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === 'products' && (
        <GiftsSection
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          statusLabel={statusLabel}
          filteredProducts={filteredProducts}
          statusClass={statusClass}
        />
      )}

      {activeTab === 'reviews' && (
        <ReviewsSection />
      )}

      {activeTab === 'favorites' && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}><i className="fa-solid fa-heart text-red-400"></i></div>
          <p>Вы ещё ничего не добавили в избранное</p>
        </div>
      )}
    </>
  )
}

export default ProfileTabs