import { useSelector } from "react-redux";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { selectOrderStatusCounts } from "../store/selectors/summarySelectors";
import Card from "../common/Card";

const COLORS = {
  Pending: "#F59E0B",
  Processing: "#0EA5E9",
  Packed: "#7C3AED",
  Delivered: "#166534",
  Cancelled: "#DC2626",
};

export default function OrderStatusChart() {
  const statusCounts = useSelector(selectOrderStatusCounts);

  return (
    <Card title="Order Status" subtitle="Orders by current status">
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusCounts}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              isAnimationActive={false}
            >
              {statusCounts.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name] || "#64748B"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
