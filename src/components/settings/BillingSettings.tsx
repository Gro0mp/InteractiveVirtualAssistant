import React from 'react'
import { CreditCard, Download, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/Button'
export function BillingSettings() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">
                    Billing & Plans
                </h2>
                <p className="text-sm text-slate-500">
                    Manage your subscription and payment methods.
                </p>
            </div>

            {/* Current Plan */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                            Current Plan
                        </h3>
                        <p className="text-sm text-slate-500">
                            You are currently on the Pro plan.
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900">
                            $29<span className="text-sm text-slate-500 font-normal">/mo</span>
                        </p>
                        <p className="text-xs text-slate-500">
                            Next billing date: Dec 1, 2023
                        </p>
                    </div>
                </div>
                <div className="p-6 bg-slate-50">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <ul className="space-y-2">
                            <li className="flex items-center text-sm text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-violet-600 mr-2" />{' '}
                                Unlimited tasks
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-violet-600 mr-2" />{' '}
                                Advanced integrations
                            </li>
                            <li className="flex items-center text-sm text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-violet-600 mr-2" />{' '}
                                Priority support
                            </li>
                        </ul>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button variant="outline" className="flex-1 sm:flex-none">
                                Cancel Plan
                            </Button>
                            <Button className="flex-1 sm:flex-none">Upgrade Plan</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Payment Method
                    </h3>
                    <Button variant="outline" size="sm">
                        Update
                    </Button>
                </div>
                <div className="flex items-center p-4 border border-slate-200 rounded-lg">
                    <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center mr-4">
                        <CreditCard className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">
                            Visa ending in 4242
                        </p>
                        <p className="text-xs text-slate-500">Expires 12/2025</p>
                    </div>
                </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Billing History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-slate-700">Date</th>
                            <th className="px-6 py-3 font-semibold text-slate-700">
                                Amount
                            </th>
                            <th className="px-6 py-3 font-semibold text-slate-700">
                                Status
                            </th>
                            <th className="px-6 py-3 font-semibold text-slate-700 text-right">
                                Invoice
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {[
                            {
                                date: 'Nov 1, 2023',
                                amount: '$29.00',
                                status: 'Paid',
                            },
                            {
                                date: 'Oct 1, 2023',
                                amount: '$29.00',
                                status: 'Paid',
                            },
                            {
                                date: 'Sep 1, 2023',
                                amount: '$29.00',
                                status: 'Paid',
                            },
                        ].map((invoice, i) => (
                            <tr key={i} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4 text-slate-600">{invoice.date}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {invoice.amount}
                                </td>
                                <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                      {invoice.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-violet-600 transition-colors">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
