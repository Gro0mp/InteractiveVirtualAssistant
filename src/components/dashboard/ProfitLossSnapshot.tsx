import React from "react";

export function ProfitLossSnapshot() {
    return (
        <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-extrabold tracking-[-0.01em]">
                        Profit & Loss
                    </h2>
                    <p className="mt-0.5 text-[12px] text-slate-500">Month to date breakdown</p>
                </div>
                <button className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                    View Full Report
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                    <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-semibold text-slate-900">Revenue</td>
                        <td className="py-2.5 text-right text-slate-700"></td>
                        <td className="py-2.5 text-right font-bold text-slate-900">$18,420</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 pl-4 text-slate-700">Product Sales</td>
                        <td className="py-2.5 text-right text-slate-600">$12,890</td>
                        <td className="py-2.5 text-right"></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 pl-4 text-slate-700">Service Revenue</td>
                        <td className="py-2.5 text-right text-slate-600">$5,530</td>
                        <td className="py-2.5 text-right"></td>
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-semibold text-slate-900">Cost of Sales</td>
                        <td className="py-2.5 text-right text-slate-700"></td>
                        <td className="py-2.5 text-right font-bold text-slate-900">$4,210</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 pl-4 text-slate-700">Materials</td>
                        <td className="py-2.5 text-right text-slate-600">$2,890</td>
                        <td className="py-2.5 text-right"></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 pl-4 text-slate-700">Labor</td>
                        <td className="py-2.5 text-right text-slate-600">$1,320</td>
                        <td className="py-2.5 text-right"></td>
                    </tr>

                    <tr className="bg-slate-50 font-bold">
                        <td className="py-2.5 text-slate-900">Gross Profit</td>
                        <td className="py-2.5 text-right"></td>
                        <td className="py-2.5 text-right text-emerald-600">$14,210</td>
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-semibold text-slate-900">Operating Expenses</td>
                        <td className="py-2.5 text-right text-slate-700"></td>
                        <td className="py-2.5 text-right font-bold text-slate-900">$5,620</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 pl-4 text-slate-700">Rent</td>
                        <td className="py-2.5 text-right text-slate-600">$2,200</td>
                        <td className="py-2.5 text-right"></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 pl-4 text-slate-700">Marketing</td>
                        <td className="py-2.5 text-right text-slate-600">$1,350</td>
                        <td className="py-2.5 text-right"></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 pl-4 text-slate-700">Utilities</td>
                        <td className="py-2.5 text-right text-slate-600">$680</td>
                        <td className="py-2.5 text-right"></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 pl-4 text-slate-700">Software & Tools</td>
                        <td className="py-2.5 text-right text-slate-600">$890</td>
                        <td className="py-2.5 text-right"></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                        <td className="py-2.5 pl-4 text-slate-700">Other</td>
                        <td className="py-2.5 text-right text-slate-600">$500</td>
                        <td className="py-2.5 text-right"></td>
                    </tr>

                    <tr className="bg-emerald-50 border-t-2 border-emerald-200">
                        <td className="py-3 text-sm font-extrabold text-slate-900">Net Profit</td>
                        <td className="py-3 text-right"></td>
                        <td className="py-3 text-right text-lg font-extrabold text-emerald-600">$8,590</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-600">Profit Margin</span>
                <span className="font-bold text-emerald-600">46.6%</span>
            </div>
        </section>
    );
}