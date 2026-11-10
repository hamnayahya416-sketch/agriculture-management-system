import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader.js";
import StatCard from "../components/common/StatCard.js";
import Card from "../components/common/Card.js";
import WeatherCard from "../components/dashboard/WeatherCard.js";
import AlertsPanel from "../components/dashboard/AlertsPanel.js";
import CropHealthList from "../components/dashboard/CropHealthList.js";
import CropHealthChart from "../components/dashboard/CropHealthChart.js";
import CuttingSchedule from "../components/dashboard/CuttingSchedule.js";
import { selectDashboardStats } from "../redux/selectors/summarySelectors.js";
import { selectLowStock } from "../redux/selectors/selectLowStock.js";
import { selectRecentActivity } from "../redux/selectors/reportSelectors.js";
import {
  formatNumber,
  formatTonnes,
  formatMoney,
  formatTodayLong,
  formatTimestamp,
  timeGreeting,
} from "../utils/formatters.js";
import {
  IconAlert,
  IconBox,
  IconMap,
  IconPlus,
  IconSprout,
  IconTrend,
} from "../components/common/icons.js";

export default function Dashboard() {
  const stats = useSelector(selectDashboardStats);
  const lowStock = useSelector(selectLowStock);
  const activity = useSelector(selectRecentActivity);

  return (
    <>
      <PageHeader
        title={timeGreeting()}
        description="Here's what's happening on your farm today."
        action={
          <div className="page-head__actions">
            <span className="date-box">{formatTodayLong()}</span>
            <Link className="btn" to="/harvest-orders">
              <IconPlus size={16} />
              New Order
            </Link>
          </div>
        }
      />

      <div className="stats-row">
        <StatCard
          icon={<IconSprout size={20} />}
          label="Total Crops"
          value={stats.cropCount}
          note="Crop types in production"
        />
        <StatCard
          icon={<IconMap size={20} />}
          tone="blue"
          label="Total Fields"
          value={stats.fieldCount}
          note="Field blocks across the farm"
        />
        <StatCard
          icon={<IconBox size={20} />}
          tone="slate"
          label="Total Harvest"
          value={formatTonnes(stats.totalStock)}
          note={`${formatNumber(stats.totalStock)} kg recorded`}
        />
        <StatCard
          icon={<IconTrend size={20} />}
          tone="green"
          label="Delivered Revenue"
          value={formatMoney(stats.revenue)}
          note={`${stats.openTasks} open tasks · ${stats.overdueTasks} overdue`}
        />
      </div>

      {lowStock.length > 0 && (
        <div className="notice" role="status">
          <IconAlert size={18} />
          <p>
            <b>{lowStock.length} inputs are running low:</b>{" "}
            {lowStock.map((item) => item.item).join(", ")}. Restock soon to avoid
            delays.
          </p>
        </div>
      )}

      <div className="grid">
        <div className="span-8">
          <CropHealthList />
        </div>

        <div className="span-4">
          <WeatherCard />
        </div>

        <div className="span-4">
          <CropHealthChart />
        </div>

        <div className="span-8">
          <CuttingSchedule />
        </div>

        <div className="span-5">
          <AlertsPanel />
        </div>

        <div className="span-7">
          <Card title="Recent Activity" subtitle="Latest changes recorded by the app">
            {activity.length === 0 ? (
              <p className="muted small">No activity recorded yet.</p>
            ) : (
              <ul className="activity">
                {activity.map((entry) => (
                  <li key={entry.id}>
                    <span className={`feed-dot feed-dot--${entry.action}`} />
                    <span className="activity__body">
                      <b>
                        {entry.user} {entry.action} {entry.entity}
                      </b>
                      <small>{entry.label}</small>
                    </span>
                    <span className="activity__date">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
