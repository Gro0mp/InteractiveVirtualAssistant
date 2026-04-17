import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Minus, CreditCard, Download, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'
import { SettingsSection } from './SettingsSection'
import { SettingsRow } from './SettingsRow'
import {useAuth} from "../../context/AuthContext.tsx";

type Plan = 'FREE' | 'BASIC' | 'PROFESSIONAL'

const PLANS = [
    {
        id: 'FREE' as Plan,
        name: 'Free',
        price: '$0',
        cadence: 'forever',
        features: ['5 mock interviews / month', 'Basic job matching', 'Resume review (1/month)', 'Community support'],
        missing: ['Priority AI responses', 'Advanced analytics'],
    },
    {
        id: 'BASIC' as Plan,
        name: 'Basic',
        price: '$19',
        cadence: '/ month',
        features: ['Unlimited mock interviews', 'Smart job matching (daily)', 'Unlimited resume tailoring', 'Email drafting', 'Priority AI responses'],
        missing: ['Advanced analytics'],
        highlighted: true,
    },
    {
        id: 'PROFESSIONAL' as Plan,
        name: 'Pro',
        price: '$29',
        cadence: '/ month',
        features: ['Everything in Basic', 'Advanced analytics', 'Custom coaching plans', 'Priority support (24hr)', 'Early feature access'],
        missing: [],
    },
]

// const INVOICES = [
//     // { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: '$19.00', status: 'paid' },
//     // { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: '$19.00', status: 'paid' },
//     // { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: '$19.00', status: 'paid' },
// ]

type Props = {
    currentPlan?: Plan
}

export function BillingTab({ currentPlan = 'FREE' }: Props) {
    const [plan, setPlan] = useState<Plan>(currentPlan)

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            {/* Current plan summary */}
            <SettingsSection tag="01" title="Current Plan" accentCorner="tl">
                <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-mono font-semibold text-neutral-900 dark:text-white">
                                {PLANS.find(p => p.id === plan)?.name}
                            </span>
                            <span className="inline-flex items-center gap-1 border border-emerald-200 dark:border-emerald-900 px-1.5 py-0.5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                <span className="text-[8px] font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active</span>
                            </span>
                        </div>
                        <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
                            Next billing date: Apr 1, 2026 · {PLANS.find(p => p.id === plan)?.price}/mo
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">Cancel plan</Button>
                    </div>
                </div>

                {/* Usage meters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Interviews used', used: 18, limit: plan === 'FREE' ? 5 : null },
                        { label: 'Resume reviews', used: 4, limit: plan === 'FREE' ? 1 : null },
                        { label: 'AI sessions', used: 31, limit: null },
                    ].map((meter) => {
                        const pct = meter.limit ? Math.min(100, Math.round((meter.used / meter.limit) * 100)) : null
                        const overLimit = pct !== null && pct >= 100
                        return (
                            <div key={meter.label}>
                                <div className="flex justify-between mb-1.5">
                                    <span className="text-[9px] font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{meter.label}</span>
                                    <span className={`text-[9px] font-mono ${overLimit ? 'text-red-500' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                        {meter.used}{meter.limit ? ` / ${meter.limit}` : ''}
                                    </span>
                                </div>
                                {meter.limit ? (
                                    <div className="h-px bg-neutral-100 dark:bg-neutral-800 relative">
                                        <div
                                            className={`absolute left-0 top-0 h-full transition-all ${overLimit ? 'bg-red-500' : 'bg-blue-500'}`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-px bg-blue-500/30 dark:bg-blue-500/20" />
                                )}
                                {!meter.limit && (
                                    <p className="mt-0.5 text-[9px] font-mono text-neutral-400 dark:text-neutral-600">Unlimited</p>
                                )}
                            </div>
                        )
                    })}
                </div>
            </SettingsSection>

            {/* Plan picker */}
            <SettingsSection tag="02" title="Change Plan" description="Upgrade or downgrade at any time" accentCorner="tr">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800">
                    {PLANS.map((p) => {
                        const isCurrent = p.id === plan
                        return (
                            <div
                                key={p.id}
                                className={[
                                    'p-5 flex flex-col gap-3 transition-colors duration-150',
                                    isCurrent
                                        ? 'bg-blue-600'
                                        : 'bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900',
                                ].join(' ')}
                            >
                                <div>
                                    <p className={`text-[9px] font-mono font-semibold uppercase tracking-widest mb-1 ${isCurrent ? 'text-blue-200' : 'text-neutral-400 dark:text-neutral-600'}`}>
                                        {p.name}
                                    </p>
                                    <div className="flex items-end gap-1">
                                        <span className={`text-2xl font-mono font-semibold ${isCurrent ? 'text-white' : 'text-neutral-900 dark:text-white'}`}>
                                            {p.price}
                                        </span>
                                        <span className={`text-[10px] font-mono pb-0.5 ${isCurrent ? 'text-blue-300' : 'text-neutral-400 dark:text-neutral-600'}`}>
                                            {p.cadence}
                                        </span>
                                    </div>
                                </div>
                                <ul className="space-y-1.5 flex-1">
                                    {p.features.map(f => (
                                        <li key={f} className={`flex items-start gap-1.5 text-[10px] font-mono ${isCurrent ? 'text-blue-100' : 'text-neutral-600 dark:text-neutral-400'}`}>
                                            <Check className={`h-3 w-3 mt-0.5 shrink-0 ${isCurrent ? 'text-blue-200' : 'text-blue-500'}`} />
                                            {f}
                                        </li>
                                    ))}
                                    {p.missing.map(f => (
                                        <li key={f} className={`flex items-start gap-1.5 text-[10px] font-mono ${isCurrent ? 'text-blue-400/50' : 'text-neutral-300 dark:text-neutral-700'}`}>
                                            <Minus className="h-3 w-3 mt-0.5 shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={isCurrent ? 'primary' : 'outline'}
                                    size="sm"
                                    className="w-full"
                                    disabled={isCurrent}
                                    onClick={() => setPlan(p.id)}
                                >
                                    {isCurrent ? 'Current plan' : p.id === 'FREE' ? 'Downgrade' : 'Upgrade'}
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </SettingsSection>

            {/* Payment method */}
            {/*<SettingsSection tag="03" title="Payment Method" accentCorner="tl">*/}
            {/*    <SettingsRow*/}
            {/*        label="Card on file"*/}
            {/*        description="Used for all subscription charges"*/}
            {/*    >*/}
            {/*        <div className="flex items-center gap-3">*/}
            {/*            <div className="flex items-center gap-2 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5">*/}
            {/*                <CreditCard className="h-3.5 w-3.5 text-neutral-400" />*/}
            {/*                <span className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300">•••• 4242</span>*/}
            {/*                <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">Exp 12/27</span>*/}
            {/*            </div>*/}
            {/*            <Button variant="ghost" size="sm">Update</Button>*/}
            {/*        </div>*/}
            {/*    </SettingsRow>*/}
            {/*</SettingsSection>*/}

            {/* Invoice history */}
            <SettingsSection tag="04" title="Invoice History" accentCorner="tl">
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                    {/*{INVOICES.map((inv) => (*/}
                    {/*    <div key={inv.id} className="flex items-center justify-between py-3">*/}
                    {/*        <div className="flex items-center gap-4">*/}
                    {/*            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">{inv.id}</span>*/}
                    {/*            <span className="text-[11px] font-mono text-neutral-700 dark:text-neutral-300">{inv.date}</span>*/}
                    {/*        </div>*/}
                    {/*        <div className="flex items-center gap-4">*/}
                    {/*            <span className="text-[11px] font-mono font-semibold text-neutral-900 dark:text-white">{inv.amount}</span>*/}
                    {/*            <span className="inline-flex items-center gap-1 border border-emerald-200 dark:border-emerald-900 px-1.5 py-0.5">*/}
                    {/*                <span className="w-1 h-1 rounded-full bg-emerald-500" />*/}
                    {/*                <span className="text-[8px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{inv.status}</span>*/}
                    {/*            </span>*/}
                    {/*            <button*/}
                    {/*                type="button"*/}
                    {/*                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"*/}
                    {/*                aria-label={`Download ${inv.id}`}*/}
                    {/*            >*/}
                    {/*                <Download className="h-3.5 w-3.5" />*/}
                    {/*            </button>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*))}*/}
                </div>
            </SettingsSection>
        </motion.div>
    )
}