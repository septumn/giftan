'use client'

import { useSession } from "next-auth/react"
import styles from "../../../page.module.css"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useAppDispatch } from "@/lib/store/hooks"
import { updateProfile } from '@/actions/update-profile'
import { setOptimisticTitleAvatar } from '@/lib/store/slices/userSlice'

const EditProfile = () => {
  const dispatch = useAppDispatch()

  const { data: session } = useSession()

  const [isEditing, setIsEditing] = useState(false)

  const [profile, setProfile] = useState({
    name: session?.user?.name,
    bio: session?.user?.bio,
  });

  const [editForm, setEditForm] = useState({ ...profile });

  useEffect(() => {
    if (session?.user?.name) {
      setProfile(prev => ({ ...prev, name: session.user.name }));
      setEditForm(prev => ({ ...prev, name: session.user.name }));

      setProfile(prev => ({ ...prev, bio: session.user.bio }));
      setEditForm(prev => ({ ...prev, bio: session.user.bio }));
    }
  }, [session]);

  const handleSave = async () => {
    try {
      const result = await updateProfile(editForm)

      dispatch(setOptimisticTitleAvatar(editForm.name))

      if (result.error) {
        toast.error(result.error)
        return
      }

      setProfile({
        name: result.nameError ? profile.name : editForm.name,
        bio: editForm.bio
      })

      if (result.nameError) {
        toast.error(result.nameError)
      }

      setIsEditing(false)
    } catch {
      toast.error('Произошла ошибка при обновлении данных')
      setIsEditing(false)
    }
  };

  return (
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

      {isEditing && (
        <div className={styles.modalOverlay} onClick={() => setIsEditing(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Редактировать профиль</h2>
              <button className={styles.modalClose} onClick={() => setIsEditing(false)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              {[
                { key: 'name', label: 'Имя', type: 'text' }
              ].map(f => (
                <div key={f.key} className={styles.formGroup}>
                  <label className={styles.formLabel}>{f.label}</label>
                  <input
                    className={styles.formInput}
                    type={f.type}
                    value={editForm[f.key]}
                    onChange={e => { setEditForm(prev => ({ ...prev, [f.key]: e.target.value })) }}
                  />
                </div>
              ))}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>О себе</label>
                <textarea
                  className={styles.formTextarea}
                  value={editForm.bio ?? ''}
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