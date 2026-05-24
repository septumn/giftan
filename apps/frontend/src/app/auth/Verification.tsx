const Verification = ({ email, dispatchTime }: { email: string, dispatchTime: string }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 text-center">

        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-at"></i>
        </div>

        <h1 className="text-xl font-bold text-slate-900 leading-tight mb-2">
          Мы отправили вам письмо по адресу:
        </h1>
        <div className="text-blue-600 font-semibold break-all mb-6">
          {email}
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 mb-8">
          <i className="fa-regular fa-clock"></i>
          <span>Время отправки: <b className="text-slate-900">{dispatchTime}</b> (МСК)</span>
        </div>

        <p className="text-slate-500 mb-8 leading-relaxed">
          Пожалуйста, проверьте почту и подтвердите письмо, чтобы завершить регистрацию.
        </p>

        <p className="mt-6 text-sm text-slate-400">
          Не получили письмо? <a href="#" className="text-blue-500 hover:underline font-medium">Отправить еще раз</a>
        </p>
      </div>
    </div>
  )
}

export default Verification