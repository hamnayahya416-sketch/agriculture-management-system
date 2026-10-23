import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, Card, EmptyState, PageHeader, Progress, Stat } from "./ui";
import {
  crops,
  cropShare,
  productionData,
  recentActivity,
  supplies,
  weather,
} from "./data";
import {
  IconAlert,
  IconBox,
  IconCloudSun,
  IconMap,
  IconPlus,
  IconSprout,
  IconTrend,
} from "./icons";

const COLORS = ["#166534", "#22C55E", "#0EA5E9", "#F59E0B", "#7C3AED", "#64748B"];

export default function Dashboard({ orders, onNewOrder }) {
  const totalStock = crops.reduce((sum, crop) => sum + crop.quantity, 0);
  const fields = new Set(crops.map((crop) => crop.field));
  const lowStock = supplies.filter((item) => item.stock < item.min);
  const delivered = orders.filter((order) => order.status === "Delivered");
  const revenue = delivered.reduce((sum, order) => sum + order.total, 0);
  const activity = recentActivity(orders, 6);

  return (
    <>
      <PageHeader
        title="Good Morning 👋"
        description="Here's what's happening on your farm today."
        action={
          <div className="page-head__actions">
            <span className="date-box">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <button type="button" className="btn" onClick={onNewOrder}>
              <IconPlus size={16} />
              New Order
            </button>
          </div>
        }
      />

      <div className="stats-row">
        <Stat
          icon={<IconSprout size={20} />}
          label="Total Crops"
          value={crops.length}
          note="Crop types in production"
        />
        <Stat
          icon={<IconMap size={20} />}
          tone="blue"
          label="Total Fields"
          value={fields.size}
          note="Field blocks across the farm"
        />
        <Stat
          icon={<IconBox size={20} />}
          tone="slate"
          label="Total Stock"
          value={`${(totalStock / 1000).toFixed(1)} t`}
          note={`${totalStock.toLocaleString()} kg in store`}
        />
        <Stat
          icon={<IconTrend size={20} />}
          tone="green"
          label="Delivered Revenue"
          value={`$${revenue.toLocaleString()}`}
          note={`From ${delivered.length} delivered orders`}
        />
      </div>

      {lowStock.length > 0 && (
        <div className="notice" role="status">
          <IconAlert size={18} />
          <p>
            <b>{lowStock.length} supplies are running low:</b>{" "}
            {lowStock.map((item) => item.item).join(", ")}. Restock soon to
            avoid delays.
          </p>
        </div>
      )}

      <div className="grid">
        <div className="span-8">
          <Card
            title="Crop Information"
            subtitle="Types of crops and quantities available"
          >
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Crop</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Field</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map((crop) => (
                    <tr key={crop.id}>
                      <td>
                        <span className="cell-title">{crop.name}</span>
                        <span className="cell-sub">CRP-{String(crop.id).padStart(3, "0")}</span>
                      </td>
                      <td>{crop.category}</td>
                      <td className="nowrap">
                        <b>{crop.quantity.toLocaleString()}</b> {crop.unit}
                      </td>
                      <td>{crop.field}</td>
                      <td>
                        <Badge>{crop.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="span-4">
          <Card
            title="Weather Information"
            subtitle={`Current conditions · ${weather.place}`}
          >
            <div className="weather-now">
              <span className="weather-now__icon">
                <IconCloudSun size={24} />
              </span>
              <div>
                <div className="weather-now__temp">
                  {weather.current.temp}°C
                </div>
                <div className="weather-now__cond">
                  {weather.current.condition}
                </div>
              </div>
            </div>

            <div className="weather-facts">
              <div>
                <span>Humidity</span>
                <strong>{weather.current.humidity}%</strong>
              </div>
              <div>
                <span>Wind</span>
                <strong>{weather.current.wind} km/h</strong>
              </div>
              <div>
                <span>Feels like</span>
                <strong>{weather.current.feels}°C</strong>
              </div>
            </div>

            <h4 className="section-label">Weather Forecast (next 3 days)</h4>
            <div className="forecast">
              {weather.forecast.map((day) => (
                <div className="forecast__day" key={day.day}>
                  <strong>{day.day}</strong>
                  <span className="cell-sub">{day.date}</span>
                  <span className="forecast__cond">{day.condition}</span>
                  <span className="forecast__temp">
                    {day.high}° / {day.low}°
                  </span>
                  <span className="forecast__rain">{day.rain}% rain</span>
                </div>
              ))}
            </div>

            <h4 className="section-label">Farm Advisory</h4>
            <ul className="advisory">
              <li>
                <span
                  className={`feed-dot feed-dot--${
                    weather.forecast[0].rain >= 50 ? "pending" : "delivered"
                  }`}
                />
                {weather.forecast[0].rain >= 50
                  ? "Rain expected tomorrow — delay spraying and field work."
                  : "Dry window ahead — a good time to harvest and transport."}
              </li>
              <li>
                <span
                  className={`feed-dot feed-dot--${
                    weather.current.humidity >= 60 ? "pending" : "delivered"
                  }`}
                />
                {weather.current.humidity >= 60
                  ? "Humidity is high — check crops for fungal disease."
                  : "Humidity is low — disease risk is currently minimal."}
              </li>
              <li>
                <span
                  className={`feed-dot feed-dot--${
                    weather.current.wind >= 15 ? "processing" : "delivered"
                  }`}
                />
                {weather.current.wind >= 15
                  ? "Strong wind — secure greenhouses and shade nets."
                  : "Calm winds — safe conditions for crop spraying."}
              </li>
            </ul>
          </Card>
        </div>

        <div className="span-7">
          <Card
            title="Crop Production"
            subtitle="Yield produced against the seasonal target"
          >
            <div className="production-list">
              {crops.map((crop) => {
                const percent = Math.round(
                  (crop.produced / crop.target) * 100
                );
                return (
                  <div className="production-row" key={crop.id}>
                    <div className="production-row__top">
                      <span className="cell-title">{crop.name}</span>
                      <Badge>{crop.status}</Badge>
                    </div>
                    <Progress value={percent} />
                    <span className="cell-sub">
                      {crop.produced} tons of {crop.target} tons target
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="span-5">
          <Card
            title="Crop Production Trend"
            subtitle="Monthly output vs target (tons)"
          >
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={productionData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="produced"
                    name="Produced"
                    fill="#166534"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={false}
                  />
                  <Line
                    dataKey="target"
                    name="Target"
                    stroke="#F59E0B"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    isAnimationActive={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="span-7">
          <Card
            title="Crop Stock Distribution"
            subtitle="Share of stored quantity by crop"
          >
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cropShare}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={2}
                    isAnimationActive={false}
                  >
                    {cropShare.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="span-5">
          <Card title="Recent Activity" subtitle="Latest orders and deliveries">
            {activity.length === 0 ? (
              <EmptyState
                title="No activity yet"
                text="Orders and deliveries will appear here."
              />
            ) : (
              <ul className="activity">
                {activity.map((item) => (
                  <li key={item.key}>
                    <span
                      className={`feed-dot feed-dot--${item.status
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    />
                    <span className="activity__body">
                      <b>{item.title}</b>
                      <small>{item.sub}</small>
                    </span>
                    <span className="activity__date">{item.date}</span>
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
