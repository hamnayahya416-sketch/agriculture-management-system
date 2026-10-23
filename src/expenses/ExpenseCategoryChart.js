import { useSelector } from "react-redux";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { createSelector } from "@reduxjs/toolkit";
import { selectExpenseItems } from "../store/selectors/entitySelectors";
import Card from "../common/Card";
import { formatMoney } from "../utils/formatters";

const COLORS = ["#166534", "#0EA5E9", "#F59E0B", "#7C3AED", "#DC2626", "#059669", "#64748B", "#DB2777"];

export const selectExpenseByCategory = createSelector([selectExpenseItems], (expenses) => {
  const totals = {};
  expenses.forEach((entry) => {
    totals[entry.category] = (totals[entry.category] || 0) + (Number(entry.amount) || 0);
  });
  return Object.entries(totals)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);
});

export default function ExpenseCategoryChart() {
  const data = useSelector(selectExpenseByCategory);

  return (
    <Card title="Spending by Category" subtitle="Where the farm budget goes">
      {data.length === 0 ? (
        <p className="muted small">No expenses recorded yet.</p>
      ) : (
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                isAnimationActive={false}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
