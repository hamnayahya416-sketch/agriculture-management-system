import { useSelector } from "react-redux";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { selectHealthStatusCounts } from "../store/selectors/cropSelectors";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";

const COLORS = {
  Healthy: "#22C55E",
  "Needs Attention": "#F59E0B",
  Critical: "#DC2626",
};

export default function CropHealthChart() {
  const data = useSelector(selectHealthStatusCounts);
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <Card title="Crop Health Chart" subtitle="Crops grouped by health status">
      {total === 0 ? (
        <EmptyState title="No data" text="Add crops to see the health breakdown." />
      ) : (
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={100}
                paddingAngle={3}
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] || "#64748B"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
