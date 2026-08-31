'use client'

import ConfirmModal from "./ConfirmModal"
import styles from "./page.module.css"
import { processLogout } from "@/actions/logout"
import { useState } from "react"
<<<<<<< HEAD
import { useApolloClient } from "@apollo/client/react"
import { useUserData } from "@/hooks/useUserData"
import { UserData } from "@/actions/user-data"

interface LogoutButtonProps {
  user: UserData
}

const LogoutButton = ({ user }: LogoutButtonProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const client = useApolloClient()

  if (!user?.id) return

  const handleLogout = async () => {
    await client.clearStore()

    await client.resetStore()

    await processLogout(user?.name as string)

    window.location.href = '/auth'
  }
=======

const LogoutButton = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

  return (
    <>
      <button className={styles.logoutBtn} onClick={() => setIsConfirmOpen(true)}>
        <i className="fa-solid fa-door-closed"></i>
      </button>
<<<<<<< HEAD
      <ConfirmModal
=======
      <ConfirmModal 
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
        isOpen={isConfirmOpen}
        title="Выйти из аккаунта?"
        message="Вы уверены, что хотите выйти из аккаунта?"
        confirmBtn="Выйти"
<<<<<<< HEAD
        onConfirm={() => handleLogout()}
=======
        onConfirm={() => processLogout()}
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  )
}

export default LogoutButton;