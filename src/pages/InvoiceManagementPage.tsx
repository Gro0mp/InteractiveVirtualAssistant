import React, { useState } from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { InvoiceList } from '../components/invoices/InvoiceList'
import { InvoiceBuilder } from '../components/invoices/InvoiceBuilder'
import { Invoice } from "../components/invoices/Invoice.tsx";
import { motion, AnimatePresence } from 'framer-motion'

type TemplateId = 'simple' | 'professional' | 'blank'

export function InvoiceManagementPage() {
    const [view, setView] = useState<'list' | 'create'>('list')
    const [template, setTemplate] = useState<TemplateId>('simple')
    return (
        <DashboardLayout>
            <AnimatePresence mode="wait">
                {view === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <InvoiceList onCreateNew={() => setView('create')} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <InvoiceBuilder
                            onBack={() => setView('list')}
                            template={template}
                            onTemplateChange={setTemplate}
                        />
                        <Invoice template={template}/>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    )
}