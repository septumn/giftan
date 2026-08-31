'use client'

import { processLogout } from "@/actions/logout"

interface ErrorComponentProps {
  hasError: boolean
}

const ErrorComponent = ({ hasError }: ErrorComponentProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans select-none">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
          <i className="fa-solid fa-circle-exclamation"></i>
        </div>

        <h1 className="text-xl font-bold text-slate-900 leading-tight mb-3">
          {hasError ? "Произошла ошибка загрузки" : "Ссылка не найдена"}
        </h1>

        <p className="text-slate-500 mb-8 leading-relaxed text-sm">
          {hasError
            ? "Не удалось получить данные о подтверждении. Возможно, возникли проблемы с соединением."
            : "Информация о времени отправки письма отсутствует или срок действия сессии истек."}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            Попробовать снова
          </button>

          <button
            onClick={() => processLogout()}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 px-4 rounded-xl transition-colors text-sm cursor-pointer"
          >
            Вернуться к авторизации
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorComponent