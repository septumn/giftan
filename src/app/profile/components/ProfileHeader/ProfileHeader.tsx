'use server'

import styles from "../../page.module.css"
import LogoutButton from '../../LogoutButton'
import Settings from "../../Settings"
import UserAvatar from '../../UserAvatar'
import EditProfile from "./EditProfile/EditProfile"

const stats = [
  { label: 'Продаж', value: '127' },
  { label: 'Отзывов', value: '98' },
  { label: 'Рейтинг', value: '4.9' },
];

const ProfileHeader = async () => {
  return (
    <div className={styles.profileCard}>
      <div className={styles.coverBand} />
      <LogoutButton />

      <Settings />

      <div className={styles.profileMain}>
        <UserAvatar />

        <EditProfile />
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
  )
}

export default ProfileHeader