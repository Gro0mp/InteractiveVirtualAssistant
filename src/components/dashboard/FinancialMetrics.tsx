import React from "react";
import { StatCard } from "./StatCard.tsx";

export function FinancialMetrics() {
    return (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
                label="Revenue (MTD)"
                value="$18,420"
                delta="+12.3%"
                trend="up"
            />
            <StatCard
                label="Expenses (MTD)"
                value="$9,830"
                delta="+5.2%"
                trend="neutral"
            />
            <StatCard
                label="Net Profit"
                value="$8,590"
                delta="+24.1%"
                trend="up"
            />
            <StatCard
                label="Cash Balance"
                value="$42,180"
                delta="-3.5%"
                trend="down"
            />
        </div>
    );
}