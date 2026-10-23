import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useSelector } from "react-redux";
import { selectInventoryTypeCounts } from "../store/selectors/selectLowStock";
import Card from "../common/Card";

export default function InventoryChart() {
  const data = useSelector(selectInventoryTypeCounts);

  return (
    <Card title="Stock by Type" subtitle="Units available per input type">
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              name="Units in store"
              fill="#166534"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
