<<<<<<< HEAD
=======
'use server'

>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
import styles from "../../page.module.css"
import LogoutButton from '../../LogoutButton'
import Settings from "../../Settings"
import UserAvatar from '../../UserAvatar'
import EditProfile from "./EditProfile/EditProfile"
<<<<<<< HEAD
import { getUserData } from "@/actions/user-data"
=======
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

const stats = [
  { label: 'Продаж', value: '127' },
  { label: 'Отзывов', value: '98' },
  { label: 'Рейтинг', value: '4.9' },
];

const ProfileHeader = async () => {
<<<<<<< HEAD
  const user = await getUserData()

  return (
    <div className={styles.profileCard}>
      <div className={styles.coverBand} />
      <LogoutButton
        user={user}
      />
=======
  return (
    <div className={styles.profileCard}>
      <div className={styles.coverBand} />
      <LogoutButton />
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

      <Settings />

      <div className={styles.profileMain}>
<<<<<<< HEAD
        <UserAvatar
          user={user}
        />

        <EditProfile
          user={user}
        />
=======
        <UserAvatar />

        <EditProfile />
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
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