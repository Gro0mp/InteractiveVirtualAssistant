import React from "react";
import { AlertCircle, Calendar } from "lucide-react";

type Bill = {
    name: string;
    amount: string;
    dueDate: string;
    status: "due-soon" | "overdue" | "upcoming";
};

export function UpcomingBills() {
    const bills: Bill[] = [
        { name: "Office Rent", amount: "$2,200", dueDate: "Feb 15", status: "due-soon" },
        { name: "Internet & Phone", amount: "$189", dueDate: "Feb 18", status: "upcoming" },
        { name: "Software Subscriptions", amount: "$890", dueDate: "Feb 20", status: "upcoming" },
        { name: "Insurance Premium", amount: "$450", dueDate: "Feb 28", status: "upcoming" },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "overdue":
                return "bg-red-50 border-red-200 text-red-700";
            case "due-soon":
                return "bg-amber-50 border-amber-200 text-amber-700";
            case "upcoming":
                return "bg-slate-50 border-slate-200 text-slate-700";
            default:
                return "bg-slate-50 border-slate-200 text-slate-700";
        }
    };

    const totalDue = bills.reduce((sum, bill) => {
        return sum + parseFloat(bill.amount.replace(/[$,]/g, ''));
    }, 0);

    return (
        <section className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 shadow-[0_10px_30px_rgba(11,18,32,0.06)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-extrabold tracking-[-0.01em]">
                        Upcoming Bills
                    </h2>
                    <p className="mt-0.5 text-[12px] text-slate-500">Bills due this month</p>
                </div>
                <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 rounded-lg px-2 py-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-semibold">1 Due Soon</span>
                </div>
            </div>

            <div className="space-y-2">
                {bills.map((bill, index) => (
                    <div
                        key={index}
                        className={`rounded-xl border p-2.5 ${getStatusStyle(bill.status)}`}
                    >
                        <div className="flex items-start justify-between mb-1">
                            <span className="text-[12px] font-bold">{bill.name}</span>
                            <span className="text-[13px] font-extrabold">{bill.amount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold opacity-80">
                            <Calendar className="h-3 w-3" />
                            <span>Due {bill.dueDate}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600">Total Due This Month</span>
                <span className="text-[15px] font-extrabold text-slate-900">
                    ${totalDue.toLocaleString()}
                </span>
            </div>

            <button className="mt-3 w-full rounded-xl bg-slate-900 text-white text-[12px] font-semibold py-2.5 hover:bg-slate-800 transition-colors">
                Schedule Payments
            </button>
        </section>
    );
}