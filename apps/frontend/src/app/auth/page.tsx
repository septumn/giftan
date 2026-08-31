'use client'

<<<<<<< HEAD
import { login, registerUser } from "@/actions/auth"
import { useEffect, useState, useRef } from "react"
import { signIn } from "next-auth/react"
import styles from "./page.module.css"
import { toast } from "sonner"
import { loginSchema } from "@/lib/schemas/validation/forms/login"
import { registerSchema } from "@/lib/schemas/validation/forms/register"
import { nameValidation } from "@/lib/schemas/validation/fields/name"
import { emailValidation } from "@/lib/schemas/validation/fields/email"
import { passwordValidation } from "@/lib/schemas/validation/fields/password"
=======
import { registerUser } from "@/actions/auth"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import styles from "./page.module.css"
import { toast } from "sonner"
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

export default function AuthPageContent() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
<<<<<<< HEAD
=======

  console.log(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))

>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

<<<<<<< HEAD
  const [inputError, setInputError] = useState<{
    name: string | null,
    email: string | null,
    password: string | null
  }>({
    name: null,
    email: null,
    password: null
  })

  const agreementRef = useRef<HTMLInputElement>(null)

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = loginSchema.safeParse({
      email: loginForm.email,
      password: loginForm.password,
    })

    if (!validation.success) {
      const firstError = validation.error.issues[0].message
      toast.error(firstError)
      return
    }

    const validData = validation.data;

    toast.promise(
      async () => {
        const result = await login({
          email: validData.email,
          password: validData.password
        });

        if (!result || !result.success) {
          throw new Error(result?.error || "Неверный email или пароль");
        }

        window.location.href = '/profile';
        return result;
      },
      {
        loading: 'Выполняется вход...',
        success: 'Успешный вход!',
        error: (err) => err.message,
      }
    );
=======
  const router = useRouter()

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.loading("Выполняется вход...")

    const result = await signIn("credentials", {
      email: loginForm.email.trim().toLowerCase(),
      password: loginForm.password,
      redirect: false,
    })

    toast.dismiss()

    if (result?.error) {
      toast.error("Неверный email или пароль")
    } else {
      window.location.href = '/profile'
    }
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
  }

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

<<<<<<< HEAD
    if (!agreementRef.current?.checked) {
      toast.error('Согласие с условиями использования и политикой конфиденциальности обязательны')
      return
    }

    const validation = registerSchema.safeParse({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
    })

    if (!validation.success) {
      const firstError = validation.error.issues[0].message

      if (firstError === 'Неверный формат почты') setError('email', firstError)

      toast.error(firstError)
      return
    }

=======
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Пароли не совпадают!')
      return
    }

<<<<<<< HEAD
    const validData = validation.data
    toast.loading("Регистрация аккаунта...")

    try {
      const formData = new FormData()
      formData.append('name', validData.name)
      formData.append('email', validData.email)
      formData.append('password', validData.password)

      const result = await registerUser(formData)
=======
    toast.loading("Регистрация аккаунта...")

    try {
      const formData = new FormData(e.currentTarget)
      const result = await registerUser(formData)

>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
      toast.dismiss()

      if (result?.error) {
        toast.error(result.error)
        return
      }

      if (result?.success) {
<<<<<<< HEAD
        setRegisterForm({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        })
        toast.success("Мы отправили письмо для подтверждения на вашу почту!")
=======
        const loginResult = await signIn("credentials", {
          email: registerForm.email.trim().toLowerCase(),
          password: registerForm.password,
          redirect: false,
        })

        if (loginResult?.error) {
          console.error("Ошибка автоматического входа:", loginResult.error)
          toast.error("Мы отправили письмо, но войти автоматически не удалось. Войдите через форму 'Вход'.")
          return
        }

        toast.success("Мы отправили письмо для подтверждения на вашу почту!")

        setTimeout(() => {
          window.location.href = '/profile'
        }, 3000)
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
      }
    } catch (err) {
      toast.dismiss()
      console.error("Критический сбой формы:", err)
      toast.error("Произошла непредвиденная ошибка. Попробуйте позже")
    }
  }

<<<<<<< HEAD
  const setError = (field: 'name' | 'email' | 'password', error: string | null = null) => {
    setInputError(prev => ({ ...prev, [field]: error }))
  }

  useEffect(() => {
    const field = 'name'

    if (registerForm.name.length === 0) {
      setError(field)
      return
    }

    setTimeout(() => {
      (registerForm.name.length <= 1 || registerForm.name.length >= 26) && setError(field, 'Имя должно быть от 2 до 25 символов')
    }, 3000)

    const errorMessage = nameValidation.safeParse(registerForm.name).error?.issues[0].message as string

    if (errorMessage) {
      if (errorMessage === 'Имя должно быть от 2 до 25 символов') return

      setError(field, errorMessage)
    } else {
      setError(field)
    }
  }, [registerForm.name, inputError.name])

  useEffect(() => {
    const field = 'email'

    const errorMessage = emailValidation.safeParse(registerForm.email).error?.issues[0].message as string

    if (errorMessage) {
      errorMessage !== 'Неверный формат почты' && setError(field, errorMessage)
    } else {
      setError(field)
    }
  }, [registerForm.email])

  useEffect(() => {
    const field = 'password'

    if (registerForm.password.length === 0) {
      setError(field)
      return
    }

    const errorMessage = passwordValidation.safeParse(registerForm.password).error?.issues[0].message as string

    if (errorMessage) {
      setError(field, errorMessage)
    } else {
      setError(field)
    }
  }, [registerForm.password])

=======
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.authHeader}>
          <div className={styles.authLogo}><i className='fas fa-gift'></i></div>
          <h1 className={styles.authTitle}>
            {isLogin ? 'Добро пожаловать!' : 'Создайте аккаунт'}
          </h1>
          <p className={styles.authSubtitle}>
            {isLogin
              ? 'Введите свои данные для входа в аккаунт'
              : 'Заполните форму для регистрации'}
          </p>
        </div>

        <div className={styles.authToggleWrapper}>
          <button
            className={`${styles.authToggleBtn} ${isLogin ? styles.active : ''}`}
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Вход
          </button>
          <button
            className={`${styles.authToggleBtn} ${!isLogin ? styles.active : ''}`}
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Регистрация
          </button>
          <div
            className={styles.authToggleSlider}
            style={{
              transform: isLogin ? 'translateX(0)' : 'translateX(100%)',
            }}
          />
        </div>

        {isLogin && (
          <form className={styles.authForm} onSubmit={handleLoginSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                name="email"
                type="email"
                autoComplete="username"
                className={styles.authInput}
                placeholder="example@mail.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Пароль</label>
              <div className={styles.passwordWrapper}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={styles.authInput}
                  placeholder="Введите пароль"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" className={styles.hiddenCheckbox} />
                <span className={styles.checkboxCustomSmall} />
                Запомнить меня
              </label>
              <a href="#" className={styles.forgotLink}>
                Забыли пароль?
              </a>
            </div>

            <button type="submit" className={styles.authSubmitBtn}>
              Войти
            </button>

            <div className={styles.divider}>
              <span>или</span>
            </div>

            <div className={styles.socialButtons}>
              <button type="button" onClick={() => signIn("google")} className={`${styles.socialBtn} ${styles.google}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button type="button" className={`${styles.socialBtn} ${styles.vk}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.734 3.23C14.734 12.813 14 12.126 14 11.11V7.603A1.104 1.104 0 0 0 12.896 6.5h-2.474a1.982 1.982 0 0 0-1.75.813s1.255-.204 1.255 1.49c0 .42.022 1.626.04 2.64a.73.73 0 0 1-1.272.503 21.54 21.54 0 0 1-2.498-4.543.693.693 0 0 0-.63-.403h-2.99a.508.508 0 0 0-.48.685C3.005 10.175 6.918 18 11.38 18h1.878a.742.742 0 0 0 .742-.742v-1.135a.73.73 0 0 1 1.23-.53l2.247 2.112a1.09 1.09 0 0 0 .746.295h2.953c1.424 0 1.424-.988.647-1.753-.546-.538-2.518-2.617-2.518-2.617a1.02 1.02 0 0 1-.078-1.323c.637-.84 1.68-2.212 2.122-2.8.603-.804 1.697-2.507.197-2.507z" />
                </svg>
                VK
              </button>
            </div>
          </form>
        )}

        {!isLogin && (
          <form className={styles.authForm} onSubmit={handleRegisterSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Имя</label>
              <input
                name="name"
                type="text"
<<<<<<< HEAD
                className={`${styles.authInput} ${inputError.name
                  ? styles.inputError
                  : ''
                  }`}
=======
                className={styles.authInput}
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
                placeholder="Ваше имя"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
              />
            </div>

<<<<<<< HEAD
            {
              inputError.name
                ? <span className={styles.errorText}>{inputError.name}</span>
                : ''
            }

=======
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email</label>
              <input
                name="email"
                type="email"
<<<<<<< HEAD
                className={`${styles.authInput} ${inputError.email
                  ? styles.inputError
                  : ''
                  }`}
=======
                className={styles.authInput}
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
                placeholder="example@mail.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
            </div>

<<<<<<< HEAD
            {
              inputError.email
                ? <span className={styles.errorText}>{inputError.email}</span>
                : ''
            }

=======
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Пароль</label>
              <div className={styles.passwordWrapper}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
<<<<<<< HEAD
                  className={`${styles.authInput} ${inputError.password
                    ? styles.inputError
                    : ''
                    }`}
=======
                  className={styles.authInput}
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
                  placeholder="Минимум 8 символов"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
<<<<<<< HEAD

              {
                inputError.password
                  ? <span className={styles.errorText}>{inputError.password}</span>
                  : ''
              }

=======
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div
                    className={styles.strengthFill}
                    style={{
                      width:
<<<<<<< HEAD
                        !inputError.password && registerForm.password
                          ? '100%'
                          : registerForm.password.length > 6
                            ? '60%'
                            : registerForm.password.length > 4
                              ? '30%'
                              : '0%',
                      background:
                        !inputError.password && registerForm.password
                          ? '#22c55e'
                          : registerForm.password.length > 6
=======
                        registerForm.password.length > 7
                          ? '100%'
                          : registerForm.password.length > 4
                            ? '60%'
                            : registerForm.password.length > 0
                              ? '30%'
                              : '0%',
                      background:
                        registerForm.password.length > 7
                          ? '#22c55e'
                          : registerForm.password.length > 4
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
                            ? '#f59e0b'
                            : '#ef4444',
                    }}
                  />
                </div>
                <span className={styles.strengthText}>
<<<<<<< HEAD
                  {
                    !inputError.password && registerForm.password
                      ? 'Надёжный'
                      : registerForm.password.length > 6
                        ? 'Средний'
                        : registerForm.password.length > 0
                          ? 'Слабый'
                          : ''
                  }
=======
                  {registerForm.password.length > 7
                    ? 'Надёжный'
                    : registerForm.password.length > 4
                      ? 'Средний'
                      : registerForm.password.length > 0
                        ? 'Слабый'
                        : ''}
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
                </span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Подтвердите пароль</label>
              <div className={styles.passwordWrapper}>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`${styles.authInput} ${registerForm.confirmPassword &&
                    registerForm.confirmPassword !== registerForm.password
                    ? styles.inputError
                    : ''
                    }`}
                  placeholder="Повторите пароль"
                  value={registerForm.confirmPassword}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
<<<<<<< HEAD

              {
                registerForm.confirmPassword &&
                registerForm.confirmPassword !== registerForm.password && (
                  <span className={styles.errorText}>Пароли не совпадают</span>
                )
              }

            </div>

            <label className={`${styles.checkboxLabel} ${styles.agreement}`}>
              <input ref={agreementRef} name="agreement" type="checkbox" className={styles.hiddenCheckbox} />
=======
              {registerForm.confirmPassword &&
                registerForm.confirmPassword !== registerForm.password && (
                  <span className={styles.errorText}>Пароли не совпадают</span>
                )}
            </div>

            <label className={`${styles.checkboxLabel} ${styles.agreement}`}>
              <input name="agreement" type="checkbox" className={styles.hiddenCheckbox} />
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
              <span data-testid="agreement-span" className={styles.checkboxCustomSmall} />
              <div className={styles.agreementText}>
                Я согласен с
                <a href="#" className={styles.linkBlue}>
                  условиями использования
                </a>
                и
                <a href="#" className={styles.linkBlue}>
                  политикой конфиденциальности
                </a>
              </div>
            </label>

            <button type="submit" className={styles.authSubmitBtn}>
              Зарегистрироваться
            </button>

            <div className={styles.divider}>
              <span>или</span>
            </div>

            <div className={styles.socialButtons}>
              <button type="button" onClick={() => signIn("google")} className={`${styles.socialBtn} ${styles.google}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button type="button" className={`${styles.socialBtn} ${styles.vk}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M21.547 7h-3.29a.743.743 0 0 0-.655.392s-1.312 2.416-1.734 3.23C14.734 12.813 14 12.126 14 11.11V7.603A1.104 1.104 0 0 0 12.896 6.5h-2.474a1.982 1.982 0 0 0-1.75.813s1.255-.204 1.255 1.49c0 .42.022 1.626.04 2.64a.73.73 0 0 1-1.272.503 21.54 21.54 0 0 1-2.498-4.543.693.693 0 0 0-.63-.403h-2.99a.508.508 0 0 0-.48.685C3.005 10.175 6.918 18 11.38 18h1.878a.742.742 0 0 0 .742-.742v-1.135a.73.73 0 0 1 1.23-.53l2.247 2.112a1.09 1.09 0 0 0 .746.295h2.953c1.424 0 1.424-.988.647-1.753-.546-.538-2.518-2.617-2.518-2.617a1.02 1.02 0 0 1-.078-1.323c.637-.84 1.68-2.212 2.122-2.8.603-.804 1.697-2.507.197-2.507z" />
                </svg>
                VK
              </button>
            </div>
          </form>
        )}

        <p className={styles.authFooter}>
          {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button
            type="button"
            className={styles.linkBlue}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div >
  )
}