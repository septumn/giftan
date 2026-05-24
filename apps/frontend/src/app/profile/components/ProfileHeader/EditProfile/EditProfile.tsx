'use client'

import { useSession } from "next-auth/react"
import styles from "../../../page.module.css"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useAppDispatch } from "@/lib/store/hooks"
import { updateProfile } from '@/actions/update-profile'
import { setOptimisticTitleAvatar } from '@/lib/store/slices/userSlice'
import { useRouter } from "next/navigation"

interface ProfileFormState {
  name: string;
  bio: string;
}

const EditProfile = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState<ProfileFormState>({
    name: session?.user?.name || '',
    bio: session?.user?.bio || '',
  });

  const [editForm, setEditForm] = useState<ProfileFormState>({ ...profile });

  useEffect(() => {
    if (session?.user) {
      const name = session.user.name || '';
      const bio = session.user.bio || '';

      setProfile({ name, bio });
      setEditForm({ name, bio });
    }
  }, [session]);

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      toast.error("Имя не может быть пустым");
      return;
    }

    try {
      const result = await updateProfile(editForm)

      if (result.error) {
        toast.error(result.error)
        return
      }

      dispatch(setOptimisticTitleAvatar(editForm.name))
      setProfile({
        name: editForm.name,
        bio: editForm.bio
      })

      setIsEditing(false)
    } catch (err) {
      console.error(err)
      toast.error('Произошла ошибка при обновлении данных')
      setIsEditing(false)
    }
  };

  return (
    <div className={styles.profileInfo}>
      <div className={styles.profileNameRow}>
        <div>
          <h1 className={styles.profileName}>{profile.name || ""}</h1>
        </div>
        <div>
          <button className={styles.editBtn} onClick={() => { setEditForm({ ...profile }); setIsEditing(true); }}>
            <i className="fa-solid fa-pencil"></i> Редактировать
          </button>
        </div>
      </div>

      <p className={styles.profileBio}>{profile.bio || ""}</p>

      {isEditing && (
        <div className={styles.modalOverlay} onClick={() => setIsEditing(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Редактировать профиль</h2>
              <button className={styles.modalClose} onClick={() => setIsEditing(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Имя</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>О себе</label>
                <textarea
                  className={styles.formTextarea}
                  value={editForm.bio}
                  onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setIsEditing(false)}>Отмена</button>
              <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditProfile