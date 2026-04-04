import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductDisplay, type CheckoutPlan } from '../components/payment/ProductDisplay'
import { SuccessDisplay } from '../components/payment/SuccessDisplay'
import { Message } from '../components/payment/Message'
import { PaymentShell } from '../components/payment/PaymentShell'
import {useAuth} from "../context/AuthContext.tsx";

export function StripePaymentPage() {
  const router = useRouter()
  const backendUrl = useMemo(() => (process.env.NEXT_PUBLIC_BACKEND_URL ?? '').replace(/\/$/, ''), [])

  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [loadingPlan, setLoadingPlan] = useState<CheckoutPlan | null>(null)
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)

    if (query.get('success')) {
      setSuccess(true)
      setSessionId(query.get('session_id') ?? '')
      setMessage('')
      return
    }

    if (query.get('canceled')) {
      setSuccess(false)
      setSessionId('')
      setMessage('Checkout canceled — select a plan anytime.')
      return
    }

    setSuccess(false)
  }, [])

  const checkout = (plan: CheckoutPlan) => {
    if (!backendUrl) {
      setMessage('NEXT_PUBLIC_BACKEND_URL is not set. Unable to start checkout.')
      return
    }

    setLoadingPlan(plan)
    setMessage('')

    const url = new URL(`${backendUrl}/create-checkout-session`)
    url.searchParams.set('plan', plan)
    window.location.href = url.toString()
  }

  const manageBilling = (sid: string) => {
    if (!backendUrl) {
      setMessage('NEXT_PUBLIC_BACKEND_URL is not set. Unable to open billing portal.')
      return
    }

    const url = new URL(`${backendUrl}/create-portal-session`)
    url.searchParams.set('session_id', sid)
    window.location.href = url.toString()
  }

  const content = () => {
    if (success && sessionId) {
      return (
        <SuccessDisplay
          sessionId={sessionId}
          onManageBilling={manageBilling}
          onGoDashboard={() => router.replace('/dashboard')}
        />
      )
    }

    if (!success && message) {
      return <Message message={message} onBack={() => router.replace('/payment')} />
    }

    return (
      <ProductDisplay
        onCheckout={checkout}
        loadingPlan={loadingPlan}
      />
    )
  }

  return (
    <PaymentShell
      title="Choose a plan"
      subtitle="Start free, or upgrade any time. Secure checkout powered by Stripe."
    >
      {content()}
    </PaymentShell>
  )
}