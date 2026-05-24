import { uploadAvatarAction } from "@/actions/avatar"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"

interface ImageCropperProps {
  onSave: () => void;
  setOptimisticAvatar: (url: string | null) => void;
}

const ImageCropper = ({ onSave, setOptimisticAvatar }: ImageCropperProps) => {
  const [imgSrc, setImgSrc] = useState('')
  const [baseSize, setBaseSize] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [minScale, setMinScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const imgRef = useRef<HTMLImageElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPos({ x: 0, y: 0 })
      setScale(1)
      setImgSrc(URL.createObjectURL(file))
    }
  }

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const frameSize = 256

    const imgW = img.naturalWidth
    const imgH = img.naturalHeight

    const ratioW = frameSize / imgW
    const ratioH = frameSize / imgH

    const initialScale = Math.max(ratioW, ratioH)

    setBaseSize({ x: imgW, y: imgH })
    setMinScale(initialScale)
    setScale(initialScale)

    setPos({
      x: (frameSize - imgW * initialScale) / 2,
      y: (frameSize - imgH * initialScale) / 2
    })
  }

  const generateResult = async () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = imgRef.current
    if (ctx && img) {
      const resultSize = 512
      canvas.width = resultSize
      canvas.height = resultSize
      const sourceX = Math.abs(pos.x) / scale
      const sourceY = Math.abs(pos.y) / scale
      const sourceWidth = 256 / scale
      const sourceHeight = 256 / scale

      ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, resultSize, resultSize)

      canvas.toBlob(async (blob) => {
        if (blob) {
          const localUrl = URL.createObjectURL(blob)
          setOptimisticAvatar(localUrl)
          onSave()

          const file = new File([blob], "avatar.webp", { type: "image/webp" })
          const formData = new FormData()
          formData.append("file", file)

          try {
            const result = await uploadAvatarAction(formData)
            if (result.success) {
              toast.success('Аватар обновлен')
            } else {
              toast.error(result.error)
              setOptimisticAvatar(null)
            }
          } catch (error) {
            setOptimisticAvatar(null)
            toast.error("Ошибка сети")
          }
        }
      }, 'image/webp', 0.7)
    }
  }

  useEffect(() => {
    setPos(prev => {
      const frameSize = 256
      const curWidth = baseSize.x * scale
      const curHeight = baseSize.y * scale

      const minX = frameSize - curWidth
      const minY = frameSize - curHeight

      return {
        x: Math.min(0, Math.max(prev.x, minX)),
        y: Math.min(0, Math.max(prev.y, minY))
      }
    })
  }, [scale, baseSize])

  const handleWheel = (e: React.WheelEvent) => {
    const zoomSpeed = 0.1
    const delta = e.deltaY > 0 ? -zoomSpeed : zoomSpeed
    const newScale = Math.min(minScale * 6, Math.max(scale + delta * minScale, minScale))

    if (newScale === scale) return

    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const relativeX = (mouseX - pos.x) / scale
    const relativeY = (mouseY - pos.y) / scale

    const newPosX = mouseX - relativeX * newScale
    const newPosY = mouseY - relativeY * newScale

    const curWidth = baseSize.x * newScale
    const curHeight = baseSize.y * newScale
    const frameSize = 256

    setPos({
      x: Math.min(0, Math.max(newPosX, frameSize - curWidth)),
      y: Math.min(0, Math.max(newPosY, frameSize - curHeight))
    })

    setScale(newScale)
  }

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault()

      // @ts-ignore
      handleWheel(e)
    }

    frame.addEventListener('wheel', handleNativeWheel, { passive: false })

    return () => {
      frame.removeEventListener('wheel', handleNativeWheel)
    }
  }, [handleWheel])

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[200px]">

      {!imgSrc && (
        <label className="flex flex-col items-center gap-4 cursor-pointer group">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-3xl">📁</span>
          </div>
          <div className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium shadow-md group-hover:bg-blue-700 transition-colors">
            Выбрать фото
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png"
            onChange={onFileChange}
          />
          <p className="text-gray-400 text-xs">JPG или PNG до 5MB</p>
        </label>
      )}

      {imgSrc && (
        <div className="flex flex-col items-center gap-6 w-full animate-in fade-in duration-300">

          <div
            className="w-64 h-64 border-4 border-white rounded-3xl overflow-hidden cursor-move relative bg-gray-100 shadow-xl"
            onWheel={handleWheel}
            ref={frameRef}
          >
            <img
              className="select-none absolute transition-none"
              ref={imgRef}
              src={imgSrc}
              onLoad={handleImageLoad}
              style={{
                maxWidth: 'none',
                maxHeight: 'none',
                width: baseSize.x + 'px',
                height: baseSize.y + 'px',
                transformOrigin: '0 0',
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
              }}
              draggable={false}
              onMouseMove={(e) => {
                if (e.buttons === 1) {
                  setPos(prev => {
                    let nextX = prev.x + e.movementX
                    let nextY = prev.y + e.movementY
                    const curWidth = baseSize.x * scale
                    const curHeight = baseSize.y * scale
                    const frameSize = 256
                    const x = Math.min(0, Math.max(nextX, frameSize - curWidth))
                    const y = Math.min(0, Math.max(nextY, frameSize - curHeight))
                    return { x, y }
                  })
                }
              }}
              alt="Preview"
            />
          </div>

          <div className="flex flex-col w-64 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-400 text-center font-medium uppercase tracking-wider">Зум</p>
              <input
                type="range"
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                min={minScale}
                max={minScale * 4}
                step={minScale / 100}
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setPos({ x: 0, y: 0 }); setScale(minScale) }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors hover:cursor-pointer"
              >
                Сбросить
              </button>
              <button
                onClick={generateResult}
                className="flex-[2] bg-blue-600 px-4 py-2 rounded-xl text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 hover:cursor-pointer"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageCropper