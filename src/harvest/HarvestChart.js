import { useSelector } from "react-redux";
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
import { selectHarvestVsSalesSeries } from "../store/selectors/summarySelectors";
import Card from "../common/Card";

export default function HarvestChart() {
  const data = useSelector(selectHarvestVsSalesSeries);

  return (
    <Card title="Harvest vs Sales" subtitle="Kilograms harvested against kilograms sold (6 months)">
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="harvest"
              name="Harvested (kg)"
              fill="#166534"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
            <Bar
              dataKey="sales"
              name="Sold (kg)"
              fill="#0EA5E9"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
