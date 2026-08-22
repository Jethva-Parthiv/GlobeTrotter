import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react'
import { uploadApi } from '@/api/uploadApi'
import { getImageUrl } from '@/utils/imageUrl'
import { cn } from '@/utils/cn'

export default function ImageUpload({
  label = 'Cover photo',
  hint = 'PNG, JPG, WEBP, or GIF up to 10MB',
  folder = 'covers',
  value = '',
  onChange,
  error = '',
  className,
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [localPreview, setLocalPreview] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = async (file) => {
    if (!file) return

    setUploadError('')

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image (JPG, PNG, WEBP, or GIF).')
      return
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be less than 10MB.')
      return
    }

    // Show immediate local preview
    const previewUrl = URL.createObjectURL(file)
    setLocalPreview(previewUrl)

    try {
      setIsUploading(true)
      const data = await uploadApi.uploadImage(file, folder)
      if (onChange) {
        onChange(data.url)
      }
      setLocalPreview('')
    } catch (err) {
      setLocalPreview('')
      const msg = err.response?.data?.detail || err.message || 'Failed to upload image'
      setUploadError(msg)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }


  const onFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const onDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileChange(file)
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    if (onChange) {
      onChange('')
    }
    setUploadError('')
  }

  const resolvedValue = getImageUrl(value)

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <span className="text-sm font-medium text-ink">{label}</span>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={onFileInputChange}
      />

      {localPreview || (value && resolvedValue) ? (
        <div className="relative overflow-hidden rounded-xl border border-line bg-sand/30">
          <img
            src={localPreview || resolvedValue}
            alt="Preview"
            className="h-48 w-full object-cover sm:h-56"
          />

          <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-md bg-paper/90 px-3 py-1.5 text-xs font-medium text-ink backdrop-blur-sm transition-colors hover:bg-paper"
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}
              {isUploading ? 'Uploading…' : 'Change photo'}
            </button>

            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-md bg-danger/80 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-danger"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all',
            isDragOver
              ? 'border-accent bg-accent-soft/20'
              : 'border-line hover:border-ink-soft hover:bg-cream/40',
            isUploading && 'cursor-wait opacity-75',
          )}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="text-sm font-medium text-ink">Uploading image to server…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sand text-ink-soft">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">
                  Click to upload <span className="text-muted font-normal">or drag & drop</span>
                </p>
                {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {(error || uploadError) && (
        <p className="text-xs text-danger">{error || uploadError}</p>
      )}
    </div>
  )
}
