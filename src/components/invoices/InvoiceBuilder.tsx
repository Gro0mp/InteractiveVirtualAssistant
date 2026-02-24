// `src/components/invoices/InvoiceBuilder.tsx`
import React, { useState } from 'react'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { TemplateSelector } from './TemplateSelector'
import { motion } from 'framer-motion'

type TemplateId = 'simple' | 'professional' | 'blank'

interface InvoiceBuilderProps {
    onBack: () => void
    template: TemplateId
    onTemplateChange: (t: TemplateId) => void
}

export function InvoiceBuilder({ onBack, template, onTemplateChange }: InvoiceBuilderProps) {
    const [items, setItems] = useState([{ id: 1, desc: '', qty: 1, price: 0 }])

    const addItem = () => {
        setItems([...items, { id: Date.now(), desc: '', qty: 1, price: 0 }])
    }

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id))
    }

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + item.qty * item.price, 0)
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Invoices
                </button>
                <div className="flex gap-3">
                    <Button variant="outline">Save Draft</Button>
                    <Button leftIcon={<Save className="w-4 h-4" />}>Create Invoice</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-8">
                    <section>
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                            Select Template
                        </h3>
                        <TemplateSelector
                            selectedTemplate={template}
                            onSelect={(id) => onTemplateChange(id as TemplateId)}
                        />
                    </section>

                    <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold text-slate-900 mb-4">Invoice Settings</h3>
                        <div className="space-y-4">
                            <Input label="Invoice Number" defaultValue="INV-005" />
                            <Input label="Issue Date" type="date" />
                            <Input label="Due Date" type="date" />
                            <div className="pt-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Currency</label>
                                <select className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                                    <option>USD (\$)</option>
                                    <option>EUR (€)</option>
                                    <option>GBP (£)</option>
                                </select>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[600px]"
                    >
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h1 className="text-4xl font-bold text-slate-900 mb-2">INVOICE</h1>
                                <p className="text-slate-500">#INV-005</p>
                            </div>
                            <div className="text-right">
                                <div className="w-32 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm border border-dashed border-slate-300">
                                    Logo
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-12 mb-12">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">From</label>
                                <div className="space-y-2">
                                    <Input placeholder="Your Company Name" className="bg-slate-50 border-transparent focus:bg-white" />
                                    <Input placeholder="Your Email" className="bg-slate-50 border-transparent focus:bg-white" />
                                    <Input placeholder="Address" className="bg-slate-50 border-transparent focus:bg-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Bill To</label>
                                <div className="space-y-2">
                                    <Input placeholder="Client Name" className="bg-slate-50 border-transparent focus:bg-white" />
                                    <Input placeholder="Client Email" className="bg-slate-50 border-transparent focus:bg-white" />
                                    <Input placeholder="Client Address" className="bg-slate-50 border-transparent focus:bg-white" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="grid grid-cols-12 gap-4 mb-2 px-2">
                                <div className="col-span-6 text-xs font-semibold text-slate-500 uppercase">Item Description</div>
                                <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase text-right">Qty</div>
                                <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase text-right">Price</div>
                                <div className="col-span-1"></div>
                            </div>

                            <div className="space-y-2">
                                {items.map((item) => (
                                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center group">
                                        <div className="col-span-6">
                                            <Input
                                                placeholder="Item name"
                                                value={item.desc}
                                                onChange={(e) => {
                                                    const newItems = items.map(i => (i.id === item.id ? { ...i, desc: e.target.value } : i))
                                                    setItems(newItems)
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <Input
                                                type="number"
                                                className="text-right"
                                                value={item.qty}
                                                onChange={(e) => {
                                                    const newItems = items.map(i => (i.id === item.id ? { ...i, qty: Number(e.target.value) } : i))
                                                    setItems(newItems)
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <Input
                                                type="number"
                                                className="text-right"
                                                value={item.price}
                                                onChange={(e) => {
                                                    const newItems = items.map(i => (i.id === item.id ? { ...i, price: Number(e.target.value) } : i))
                                                    setItems(newItems)
                                                }}
                                            />
                                        </div>
                                        <div className="col-span-1 text-center">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={addItem} className="mt-4 flex items-center text-sm font-medium text-violet-600 hover:text-violet-700">
                                <Plus className="w-4 h-4 mr-1" /> Add Item
                            </button>
                        </div>

                        <div className="flex justify-end border-t border-slate-100 pt-8">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>\${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Tax (0%)</span>
                                    <span>\$0.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
                                    <span>Total</span>
                                    <span>\${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
