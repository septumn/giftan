'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import styles from "./page.module.css"
import ImageCropper from "@/components/ui/ImageCropper"
import { toast } from "sonner"
import { deleteAvatarAction } from "../../actions/avatar"
import { useRouter } from "next/navigation"
import ConfirmModal from "./ConfirmModal"
import { useAppSelector } from "@/lib/store/hooks"

const UserAvatar = () => {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [optimisticAvatar, setOptimisticAvatar] = useState<string | null>(null)
  const optimisticTitleAvatar = useAppSelector((state) => state.user.optimisticTitleAvatar)

  const initials = (optimisticTitleAvatar || session?.user?.name)
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || ''

  useEffect(() => {
    if (optimisticAvatar) {
      setCurrentImage(optimisticAvatar)
      return
    }

    if (status === 'loading') return

    if (session?.user.image?.startsWith('https://googleusercontent.com')) {
      setCurrentImage(session.user.image)
      return
    }

    if (session?.user.image) {
      setCurrentImage(`${process.env.NEXT_PUBLIC_AVATARS_URL}/${session.user.image}`)
      return
    }

    setCurrentImage(null)
  }, [status, optimisticAvatar])

  const handleUpload = () => {
    setIsUploading(true)
    setIsModalOpen(false)
    setTimeout(() => {
      setIsUploading(false)
      router.refresh()
    }, 300)
  }

  const handleDelete = async () => {
    try {
      const result = await deleteAvatarAction()
      if (result.success) {
        setOptimisticAvatar(null)
        await update()
        router.refresh()
        setIsModalOpen(false)
        setIsConfirmOpen(false)
      } else {
        toast.error(result.error || "Ошибка удаления")
      }
    } catch (err) {
      toast.error("Что-то пошло не так")
    }
  }

  return (
    <div className={styles.avatarWrap}>
      <div
        className={`${styles.avatar} group relative cursor-pointer overflow-hidden rounded-[30px] border-4 border-transparent hover:border-blue-500 transition-all`}
        onClick={() => setIsModalOpen(true)}
      >
        {isUploading ? (
          <div className="flex items-center justify-center w-full h-full bg-gray-50">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : currentImage ? (
          <div className="relative w-full h-full">
            <Image
              key={currentImage}
              src={currentImage}
              alt={initials}
              crossOrigin="anonymous"
              fill
              unoptimized
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-2xl">✎</span>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center text-xl text-blue-600 font-bold bg-gray-100">
            {initials}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-3xl">+</span>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center mt-[-500px] bg-black/50 backdrop-blur-sm p-4 select-none animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl relative flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200 animate-slide-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`${styles.modalClose} absolute top-4 right-5`}
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-6 text-center text-gray-800">
              {currentImage ? "Редактировать фото" : "Добавить фото"}
            </h3>

            <ImageCropper
              onSave={handleUpload}
              setOptimisticAvatar={setOptimisticAvatar}
            />

            {currentImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsModalOpen(false)
                  setIsConfirmOpen(true)
                }}
                className="mt-6 text-red-500 hover:text-red-600 transition-colors font-medium text-sm hover:cursor-pointer"
              >
                Удалить текущее фото
              </button>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Удалить фото?"
        message="Вы уверены, что хотите удалить аватар?"
        confirmBtn="Удалить"
        onConfirm={handleDelete}
        onCancel={() => {
          setIsConfirmOpen(false)
          setIsModalOpen(true)
        }}
      />
      <div className={styles.avatarBadge}>✓</div>
    </div>
  )
}

export default UserAvatar