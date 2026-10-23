import { useSelector } from "react-redux";
import { selectOrdersSummary } from "../store/selectors/summarySelectors";
import Card from "../common/Card";
import { formatNumber, formatMoney } from "../utils/formatters";
import { IconCart, IconCheckCircle, IconTrend, IconUsers } from "../common/icons";

export default function OrdersSummary() {
  const summary = useSelector(selectOrdersSummary);

  return (
    <Card title="Orders Summary" subtitle="Order volume and sales performance">
      <div className="summary-kpis">
        <div className="summary-kpi">
          <span className="summary-kpi__icon">
            <IconCart size={18} />
          </span>
          <span className="summary-kpi__label">Total orders</span>
          <b>{summary.totalOrders}</b>
          <small className="cell-sub">{summary.activeOrders} active now</small>
        </div>

        <div className="summary-kpi">
          <span className="summary-kpi__icon summary-kpi__icon--blue">
            <IconTrend size={18} />
          </span>
          <span className="summary-kpi__label">Quantity sold</span>
          <b>{formatNumber(summary.quantitySold)} kg</b>
          <small className="cell-sub">All confirmed sales</small>
        </div>

        <div className="summary-kpi">
          <span className="summary-kpi__icon summary-kpi__icon--green">
            <IconCheckCircle size={18} />
          </span>
          <span className="summary-kpi__label">Delivered revenue</span>
          <b>{formatMoney(summary.revenue)}</b>
          <small className="cell-sub">{summary.deliveredOrders} delivered</small>
        </div>

        <div className="summary-kpi">
          <span className="summary-kpi__icon summary-kpi__icon--violet">
            <IconUsers size={18} />
          </span>
          <span className="summary-kpi__label">Buyers</span>
          <b>{summary.totalBuyers}</b>
          <small className="cell-sub">Registered buyers</small>
        </div>
      </div>
    </Card>
  );
}
