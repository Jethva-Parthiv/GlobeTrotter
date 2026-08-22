import { useState } from 'react'
import { userApi } from '@/api/userApi'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { getApiErrorMessage } from '@/utils/apiError'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const [confirm, setConfirm] = useState(false)
  const [pending, setPending] = useState(false)

  const onDelete = async () => {
    setPending(true)
    try {
      await userApi.deleteMe()
      toast.success('Account deleted')
      logout()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
      setPending(false)
      setConfirm(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-display text-3xl">Settings</h1>
      <Card>
        <h2 className="font-medium">Account</h2>
        <p className="mt-1 text-sm text-muted">{user?.email}</p>
        <p className="mt-2 text-sm text-ink-soft">
          Privacy for each trip is controlled on the trip itself (public or private).
        </p>
      </Card>
      <Card className="border-danger/20">
        <h2 className="font-medium text-danger">Delete account</h2>
        <p className="mt-2 text-sm text-muted">
          This permanently deletes your account and all of your trips.
        </p>
        <Button className="mt-4" variant="danger" onClick={() => setConfirm(true)}>
          Delete account
        </Button>
      </Card>
      <ConfirmDialog
        open={confirm}
        title="Delete your account?"
        description="This cannot be undone. All trips will be removed."
        confirmLabel={pending ? 'Deleting…' : 'Delete account'}
        destructive
        onCancel={() => setConfirm(false)}
        onConfirm={onDelete}
      />
    </div>
  )
}
