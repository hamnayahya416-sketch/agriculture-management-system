import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import PageHeader from "../common/PageHeader";
import StatCard from "../common/StatCard";
import Card from "../common/Card";
import OrderForm from "../harvest/OrderForm";
import OrdersTable from "../harvest/OrdersTable";
import { selectOrdersSummary, selectOrderStatusCounts } from "../store/selectors/summarySelectors";
import { formatNumber, formatMoney } from "../utils/formatters";
import { IconCart, IconCheckCircle, IconPlus, IconTrend, IconUsers } from "../common/icons";

const COLORS = {
  Pending: "#F59E0B",
  Processing: "#0EA5E9",
  Packed: "#7C3AED",
  Delivered: "#166534",
  Cancelled: "#DC2626",
};

export default function HarvestOrders() {
  const summary = useSelector(selectOrdersSummary);
  const statusCounts = useSelector(selectOrderStatusCounts);
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <PageHeader
        title="Harvest and Orders"
        description="Track the season's harvest, customer orders and stock sold."
        action={
          <button
            type="button"
            className="btn"
            onClick={() => setShowForm((value) => !value)}
          >
            <IconPlus size={16} />
            {showForm ? "Hide order form" : "New Order"}
          </button>
        }
      />

      <div className="stats-row">
        <StatCard
          icon={<IconCart size={20} />}
          label="Total orders"
          value={summary.totalOrders}
          note={`${summary.activeOrders} active · ${summary.deliveredOrders} delivered`}
        />
        <StatCard
          icon={<IconTrend size={20} />}
          tone="blue"
          label="Quantity sold"
          value={`${formatNumber(summary.quantitySold)} kg`}
          note="Orders + buyer purchases"
        />
        <StatCard
          icon={<IconCheckCircle size={20} />}
          label="Delivered revenue"
          value={formatMoney(summary.revenue)}
          note="From delivered orders"
        />
        <StatCard
          icon={<IconUsers size={20} />}
          tone="slate"
          label="Buyers"
          value={summary.totalBuyers}
          note="Registered buyers"
        />
      </div>

      <div className="grid">
        {showForm && (
          <div className="span-8">
            <OrderForm onShowOrders={() => setShowForm(false)} />
          </div>
        )}

        <div className={showForm ? "span-4" : "span-8"}>
          <OrdersTable />
        </div>

        <div className="span-4">
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
        </div>
      </div>
    </>
  );
}
