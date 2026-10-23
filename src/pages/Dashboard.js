import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PageHeader from "../common/PageHeader";
import StatCard from "../common/StatCard";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import WeatherCard from "../dashboard/WeatherCard";
import AlertsPanel from "../dashboard/AlertsPanel";
import {
  selectAllCrops,
} from "../store/selectors/cropSelectors";
import {
  selectDashboardStats,
} from "../store/selectors/summarySelectors";
import { selectLowStock } from "../store/selectors/selectLowStock";
import { selectRecentActivity } from "../store/selectors/reportSelectors";
import { formatNumber, formatTonnes, formatMoney, formatTodayLong, formatTimestamp, timeGreeting } from "../utils/formatters";
import {
  IconAlert,
  IconBox,
  IconMap,
  IconPlus,
  IconSprout,
  IconTrend,
} from "../common/icons";

export default function Dashboard() {
  const stats = useSelector(selectDashboardStats);
  const crops = useSelector(selectAllCrops);
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
          note={`From ${stats.totalOrders} orders · ${stats.buyerCount} buyers`}
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
          <Card
            title="Crop Information"
            subtitle="Types of crops, quantities and health status"
            action={
              <Link className="btn btn--ghost btn--sm" to="/crops">
                Manage crops
              </Link>
            }
          >
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Crop</th>
                    <th>Category</th>
                    <th>Harvest qty</th>
                    <th>Field</th>
                    <th>Health</th>
                    <th>Cutting date</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map((crop) => (
                    <tr key={crop.id}>
                      <td>
                        <span className="cell-title">{crop.name}</span>
                        <span className="cell-sub">
                          CRP-{String(crop.id).padStart(3, "0")}
                        </span>
                      </td>
                      <td>{crop.category}</td>
                      <td className="nowrap">
                        <b>{formatNumber(crop.harvestQty)}</b> {crop.unit}
                      </td>
                      <td>{crop.field}</td>
                      <td>
                        <StatusBadge>{crop.status}</StatusBadge>
                      </td>
                      <td className="nowrap">{crop.cuttingDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="span-4">
          <WeatherCard />
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
