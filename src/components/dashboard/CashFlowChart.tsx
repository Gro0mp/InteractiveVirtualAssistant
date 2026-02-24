import React from "react";

export function CashFlowChart() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Sample data - in production, this would come from props or API
    const cashFlowData = [
        { income: 15200, expenses: 8900 },
        { income: 18400, expenses: 9200 },
        { income: 16800, expenses: 10100 },
        { income: 19200, expenses: 8700 },
        { income: 21500, expenses: 9800 },
        { income: 17900, expenses: 11200 },
        { income: 23100, expenses: 10500 },
        { income: 19800, expenses: 9400 },
        { income: 22400, expenses: 10800 },
        { income: 20100, expenses: 9600 },
        { income: 24300, expenses: 11400 },
        { income: 18420, expenses: 9830 }
    ];

    const maxValue = Math.max(...cashFlowData.flatMap(d => [d.income, d.expenses]));

    return (
        <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-extrabold tracking-[-0.01em]">
                        Cash Flow Overview
                    </h2>
                    <p className="mt-0.5 text-[12px] text-slate-500">Monthly income vs expenses</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[11px]">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-600">Income</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                        <div className="h-2.5 w-2.5 rounded-full bg-rose-500"></div>
                        <span className="text-slate-600">Expenses</span>
                    </div>
                </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-1.5 px-2">
                {months.map((month, i) => {
                    const data = cashFlowData[i];
                    const incomeHeight = (data.income / maxValue) * 100;
                    const expenseHeight = (data.expenses / maxValue) * 100;

                    return (
                        <div key={month} className="flex flex-col items-center gap-1 flex-1 group">
                            <div className="flex w-full gap-1">
                                <div
                                    className="w-1/2 rounded-t bg-emerald-500 transition-all group-hover:bg-emerald-600"
                                    style={{ height: `${incomeHeight * 2}px` }}
                                    title={`Income: $${data.income.toLocaleString()}`}
                                ></div>
                                <div
                                    className="w-1/2 rounded-t bg-rose-400 transition-all group-hover:bg-rose-500"
                                    style={{ height: `${expenseHeight * 2}px` }}
                                    title={`Expenses: $${data.expenses.toLocaleString()}`}
                                ></div>
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1">{month}</span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-3 gap-3 text-center">
                <div>
                    <div className="text-[11px] font-semibold text-slate-600">Avg Income</div>
                    <div className="text-[15px] font-bold text-slate-900 mt-0.5">$19,852</div>
                </div>
                <div>
                    <div className="text-[11px] font-semibold text-slate-600">Avg Expenses</div>
                    <div className="text-[15px] font-bold text-slate-900 mt-0.5">$9,952</div>
                </div>
                <div>
                    <div className="text-[11px] font-semibold text-slate-600">Avg Profit</div>
                    <div className="text-[15px] font-bold text-emerald-600 mt-0.5">$9,900</div>
                </div>
            </div>
        </section>
    );
}