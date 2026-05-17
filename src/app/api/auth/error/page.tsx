export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-90">
      <h1 className="text-2xl font-bold text-red-600">Ой! Ошибка авторизации</h1>
      <p className="mt-2 text-gray-600">Что-то пошло не так при входe</p>
      <a href="/authorization" className="mt-4 text-blue-500 underline">
        Попробовать снова
      </a>
    </div>
  )
}