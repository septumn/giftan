'use server'

// import { useState, useEffect } from 'react'
import styles from './page.module.css'
import { useSession } from 'next-auth/react'
import { updateProfile } from '../../actions/update-profile'
import { toast } from 'sonner'
import UserAvatar from './UserAvatar'
// import EditProfile from './EditProfile'
import { useAppDispatch } from '@/lib/store/hooks'
import { setOptimisticTitleAvatar } from '@/lib/store/slices/userSlice'
import LogoutButton from './LogoutButton'
import ProfileHeader from './components/ProfileHeader/ProfileHeader'
import ProfileTabs from './components/ProfileTabs/ProfileTabs'
import { auth } from '@/auth'
import { db } from "@/db"

const mockProducts = [
  { id: 1, name: 'Серебряный браслет', price: 4200, category: 'Украшения', status: 'active', image: '💎' },
  { id: 2, name: 'Кожаный кошелёк', price: 3800, category: 'Аксессуары', status: 'active', image: '👜' },
  { id: 3, name: 'Хрустальная ваза', price: 6500, category: 'Декор', status: 'sold', image: '🏺' },
  { id: 4, name: 'Шёлковый шарф', price: 2900, category: 'Одежда', status: 'active', image: '🧣' },
  { id: 5, name: 'Деревянная шкатулка', price: 1800, category: 'Декор', status: 'hidden', image: '📦' },
  { id: 6, name: 'Янтарные серьги', price: 5100, category: 'Украшения', status: 'active', image: '✨' },
];

const stats = [
  { label: 'Продаж', value: '127' },
  { label: 'Отзывов', value: '98' },
  { label: 'Рейтинг', value: '4.9' },
];

export default async function ProfilePage() {
  const session = await auth();

  const user = session?.user?.id
    ? await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.id, session.user.id),
      with: {
        soldGifts: true
      }
    })
    : null

  // const dispatch = useAppDispatch()

  // const { data: session, status } = useSession()
  // const isLoading = status === 'loading'

  // const [activeTab, setActiveTab] = useState('products')
  // const [isEditing, setIsEditing] = useState(false)
  // const [filterStatus, setFilterStatus] = useState('all')

  // const [profile, setProfile] = useState({
  //   name: 'Гость',
  //   bio: 'Описание',
  // });
  // const [editForm, setEditForm] = useState({ ...profile });

  // useEffect(() => {
  //   if (session?.user?.name) {
  //     setProfile(prev => ({ ...prev, name: session.user.name }));
  //     setEditForm(prev => ({ ...prev, name: session.user.name }));

  //     setProfile(prev => ({ ...prev, bio: session.user.bio }));
  //     setEditForm(prev => ({ ...prev, bio: session.user.bio }));
  //   }
  // }, [session]);

  // const filteredProducts = mockProducts.filter(p =>
  //   filterStatus === 'all' ? true : p.status === filterStatus
  // );

  // const handleSave = async () => {
  //   try {
  //     const result = await updateProfile(editForm)

  //     dispatch(setOptimisticTitleAvatar(editForm.name))

  //     if (result.error) {
  //       toast.error(result.error)
  //       return
  //     }

  //     setProfile({
  //       name: result.nameError ? profile.name : editForm.name,
  //       bio: editForm.bio
  //     })

  //     if (result.nameError) {
  //       toast.error(result.nameError)
  //     }

  //     setIsEditing(false)
  //   } catch {
  //     toast.error('Произошла ошибка при обновлении данных')
  //     setIsEditing(false)
  //   }
  // };

  // const statusLabel = { active: 'Активен', sold: 'Продан', hidden: 'Скрыт' }
  // const statusClass = { active: styles.statusActive, sold: styles.statusSold, hidden: styles.statusHidden }

  return (
    <div className={styles.page}>
      <div className={styles.heroBlob} />

      <div className={styles.container}>
        <ProfileHeader />

        <ProfileTabs />
        {/* <div className={styles.profileCard}>
          <div className={styles.coverBand} />
          <LogoutButton />

          <div className={styles.profileMain}>
            <UserAvatar />

            <div className={styles.profileInfo}>
              <div className={styles.profileNameRow}>
                <div>
                  <h1 className={styles.profileName}>{profile?.name}</h1>
                </div>
                <div className=''>
                  <button className={styles.editBtn} onClick={() => { setEditForm({ ...profile }); setIsEditing(true); }}>
                    <i className="fa-solid fa-pencil"></i> Редактировать
                  </button>
                </div>
              </div>

              <p className={styles.profileBio}>{profile.bio}</p>
            </div>
          </div>

          <div className={styles.statsRow}>
            {stats.map(s => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

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

        {activeTab === 'products' && (
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
              <button className={styles.addBtn}>+ Добавить товар</button>
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
        )}

        {activeTab === 'reviews' && (
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
        )}

        {activeTab === 'favorites' && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}><i className="fa-solid fa-heart text-red-400"></i></div>
            <p>Вы ещё ничего не добавили в избранное</p>
          </div>
        )} */}
      </div>

      {/* {isEditing && (
        <EditProfile
          setIsEditing={setIsEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          handleSave={handleSave}
        />
      )} */}
    </div>
  );
}