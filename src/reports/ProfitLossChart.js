import { useSelector } from "react-redux";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { selectProfitLossSeries } from "../store/selectors/selectProfitByCrop";
import Card from "../common/Card";

export default function ProfitLossChart() {
  const data = useSelector(selectProfitLossSeries);

  return (
    <Card title="Profit & Loss" subtitle="Revenue against expenses over the last 6 months">
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={0} stroke="var(--muted)" />
            <Bar
              dataKey="revenue"
              name="Revenue ($)"
              fill="#166534"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="expense"
              name="Expenses ($)"
              fill="#DC2626"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
            <Line
              dataKey="profit"
              name="Profit ($)"
              stroke="#0EA5E9"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
