import styles from "../../page.module.css"

const TabSection = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.tabs}>
      {['products', 'reviews', 'favorites'].map(tab => (
        <button
          key={tab}
          className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab === 'products' && <><i className='fa-solid fa-briefcase text-blue-400'></i> Товары</>}
          {tab === 'reviews' && <><i className="fa-solid fa-star text-yellow-400"></i> Отзывы</>}
          {tab === 'favorites' && <><i className="fa-solid fa-heart text-red-400"></i> Избранное</>}
        </button>
      ))}
    </div>
  )
}

export default TabSection