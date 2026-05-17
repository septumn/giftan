'use client'

import ConfirmModal from "./ConfirmModal"
import styles from "./page.module.css"
import { signOut } from "next-auth/react"
import { useState } from "react"

const LogoutButton = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  return (
    <>
      <button className={styles.logoutBtn} onClick={() => setIsConfirmOpen(true)}>
        <i className="fa-solid fa-door-closed"></i>
      </button>
      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="Выйти из аккаунта?"
        message="Вы уверены, что хотите выйти из аккаунта?"
        confirmBtn="Выйти"
        onConfirm={() => signOut({ redirectTo: '/' })}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  )
}

export default LogoutButton;