import React from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, FileText, Download, Send, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
const invoices = [
    {
        id: 'INV-001',
        client: 'Acme Corp',
        date: 'Oct 24, 2023',
        amount: '$1,200.00',
        status: 'Paid',
        statusColor: 'bg-green-100 text-green-700',
    },
    {
        id: 'INV-002',
        client: 'Globex Inc',
        date: 'Oct 28, 2023',
        amount: '$850.00',
        status: 'Pending',
        statusColor: 'bg-yellow-100 text-yellow-700',
    },
    {
        id: 'INV-003',
        client: 'Soylent Corp',
        date: 'Nov 02, 2023',
        amount: '$2,400.00',
        status: 'Draft',
        statusColor: 'bg-slate-100 text-slate-700',
    },
    {
        id: 'INV-004',
        client: 'Umbrella Corp',
        date: 'Nov 05, 2023',
        amount: '$3,150.00',
        status: 'Pending',
        statusColor: 'bg-yellow-100 text-yellow-700',
    },
]
interface InvoiceListProps {
    onCreateNew: () => void
}
export function InvoiceList({ onCreateNew }: InvoiceListProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Invoices</h2>
                    <p className="text-slate-500 text-sm">Manage your billing and payments.</p>
                </div>
                <Button onClick={onCreateNew} leftIcon={<Plus className="w-4 h-4" />}>
                    Create Invoice
                </Button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Invoice ID</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Client</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Date</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Amount</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {invoices.map((invoice, index) => (
                            <motion.tr
                                key={invoice.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-slate-50/50 transition-colors group"
                            >
                                <td className="px-6 py-4 font-medium text-violet-600">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-400" />
                                        {invoice.id}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-900">{invoice.client}</td>
                                <td className="px-6 py-4 text-slate-500">{invoice.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{invoice.amount}</td>
                                <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.statusColor}`}>
                      {invoice.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Send">
                                            <Send className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Download">
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <p className="text-sm text-slate-500">Showing 4 of 12 invoices</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}