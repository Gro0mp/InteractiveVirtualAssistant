import React from 'react'
import { PaymentStatus } from './PaymentStatus'

export function Message({
  message,
  onBack,
}: {
  message: string
  onBack?: () => void
}) {
  return (
    <PaymentStatus
      variant="info"
      title="Payment status"
      message={message}
      actionLabel={onBack ? 'Back' : undefined}
      onAction={onBack}
    />
  )
}