'use client'
import { useEffect, useState } from "react"
import styles from "./page.module.css"
import { toast } from "sonner"
import { changePasswordSchema, emailValidation } from "@/lib/schemas"

type ViewState = 'menu' | 'change_email' | 'change_password' | 'email_code'

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<ViewState>('menu')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' })
  const [passwordsError, setPasswordsError] = useState({ type: '', message: '' })
  const [oldPasswordErrors, setOldPasswordErrors] = useState(true)
  const [newPasswordErrors, setNewPasswordErrors] = useState(true)

  const resetAndClose = () => {
    setIsOpen(false)
    setView('menu')
    setEmail('')
    setCode('')
  }

  const handleSendCode = () => {
    const validation = emailValidation.safeParse(email)

    if (!validation.success) {
      toast.error(validation.error.issues[0]?.message || 'Ошибка валидации')
      return
    }

    setView('email_code')
  }

  const handleChangePassword = () => {
    if (oldPasswordErrors || newPasswordErrors) return

    toast.success("Пароль обновлен")

    resetAndClose()
  }

  useEffect(() => {
    const validation = changePasswordSchema.safeParse(passwords)

    if (!validation.success) {
      const firstIssue = validation.error.issues[0]

      if (firstIssue?.path?.includes('oldPassword')) {
        setOldPasswordErrors(true)
        setPasswordsError({ type: 'old', message: firstIssue?.message })
      } else {
        setOldPasswordErrors(false)
      }

      if (firstIssue?.path?.includes('newPassword')) {
        setNewPasswordErrors(true)
        setPasswordsError({ type: 'new', message: firstIssue?.message })
      } else {
        setNewPasswordErrors(false)
      }
    } else {
      setOldPasswordErrors(false)
      setNewPasswordErrors(false)
      setPasswordsError({ type: '', message: '' })
    }
  }, [passwords.oldPassword, passwords.newPassword])

  return (
    <>
      <button className={styles.settingsBtn} onClick={() => setIsOpen(true)}>
        <i className="fa-solid fa-gear"></i>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center mt-[-550px] justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl relative animate-in fade-in zoom-in duration-200 animate-slide-up">

            <button onClick={resetAndClose} className={`${styles.modalClose} absolute top-4 right-5`}>
              ✕
            </button>

            <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
              {view === 'menu' && "Настройки аккаунта"}
              {view === 'change_email' && "Смена почты"}
              {view === 'email_code' && "Подтверждение"}
              {view === 'change_password' && "Смена пароля"}
            </h3>

            <div className="space-y-4">
              {view === 'menu' && (
                <>
                  <button
                    onClick={() => setView('change_email')}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-medium text-gray-700 text-left flex justify-between hover:cursor-pointer"
                  >
                    Сменить почту <span>→</span>
                  </button>
                  <button
                    onClick={() => setView('change_password')}
                    className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-medium text-gray-700 text-left flex justify-between hover:cursor-pointer"
                  >
                    Сменить пароль <span>→</span>
                  </button>
                </>
              )}

              {view === 'change_email' && (
                <div className="flex flex-col gap-4">
                  <input
                    type="email"
                    placeholder="Новый адрес почты"
                    className={styles.formInput}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    onClick={() => handleSendCode()}
                    className="w-full py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all hover:cursor-pointer"
                  >
                    Отправить код
                  </button>
                  <button onClick={() => setView('menu')} className={styles.cancelBtn}>Назад</button>
                </div>
              )}

              {view === 'email_code' && (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-gray-500 text-center">Код отправлен на {email}</p>
                  <input
                    type="text"
                    placeholder="Введите код"
                    className={`${styles.formInputCode} w-full p-3 text-center tracking-widest text-xl rounded-xl border border-gray-200 outline-none focus:border-blue-500 hover:cursor-pointer`}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button
                    onClick={() => { toast.success("Почта успешно изменена!"); resetAndClose(); }}
                    className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all hover:cursor-pointer"
                  >
                    Подтвердить
                  </button>
                  <button onClick={() => setView('change_email')} className={styles.cancelBtn}>Изменить почту</button>
                </div>
              )}

              {view === 'change_password' && (
                <div className="flex flex-col gap-3">
                  <p>{passwordsError.type === 'old' && passwordsError.message}</p>
                  <input
                    type="password"
                    placeholder="Старый пароль"
                    className={`${styles.formInput} ${oldPasswordErrors ? '!border-red-500' : ''}`}
                    onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  />
                  <p>{passwordsError.type === 'new' && passwordsError.message}</p>
                  <input
                    type="password"
                    placeholder="Новый пароль"
                    className={`${styles.formInput} ${newPasswordErrors ? '!border-red-500' : ''}`}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  />
                  <button
                    onClick={() => handleChangePassword()}
                    className={`w-full mt-2 py-3 ${oldPasswordErrors || newPasswordErrors ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-500 hover:cursor-pointer'} text-white rounded-xl font-bold transition-all`}
                  >
                    Обновить пароль
                  </button>
                  <button onClick={() => setView('menu')} className={styles.cancelBtn}>Назад</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Settings