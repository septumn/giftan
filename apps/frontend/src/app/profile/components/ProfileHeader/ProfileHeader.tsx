import styles from "../../page.module.css"
import LogoutButton from '../../LogoutButton'
import Settings from "../../Settings"
import UserAvatar from '../../UserAvatar'
import EditProfile from "./EditProfile/EditProfile"
import { getUserData } from "@/actions/user-data"

const stats = [
  { label: 'Продаж', value: '127' },
  { label: 'Отзывов', value: '98' },
  { label: 'Рейтинг', value: '4.9' },
];

const ProfileHeader = async () => {
  const user = await getUserData()

  return (
    <div className={styles.profileCard}>
      <div className={styles.coverBand} />
      <LogoutButton
        user={user}
      />

      <Settings />

      <div className={styles.profileMain}>
        <UserAvatar
          user={user}
        />

        <EditProfile
          user={user}
        />
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