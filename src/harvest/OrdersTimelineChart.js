import { useSelector } from "react-redux";
import {
  Bar,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { selectOrdersOverTime } from "../store/selectors/summarySelectors";
import Card from "../common/Card";

export default function OrdersTimelineChart() {
  const data = useSelector(selectOrdersOverTime);

  return (
    <Card title="Orders Over Time" subtitle="Monthly order revenue and order count">
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              yAxisId="right"
              orientation="right"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              name="Revenue ($)"
              fill="#166534"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              dataKey="orders"
              name="Orders"
              stroke="#F59E0B"
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
