import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import { selectMonthlyReport } from "../store/selectors/reportSelectors";
import { showToast } from "../store/actions/uiActions";
import { formatDate, formatMoney, formatNumber } from "../utils/formatters";
import { exportCsv } from "../utils/exportCsv";
import { IconDownload, IconFileText, IconPrint } from "../common/icons";

export default function MonthlyReport({ month }) {
  const dispatch = useDispatch();
  const report = useSelector((state) => selectMonthlyReport(state, month));

  function exportOrders() {
    const ok = exportCsv(
      `agricore-orders-${report.month}.csv`,
      report.orders.map((order) => ({
        id: order.id,
        customer: order.customer,
        orderDate: order.orderDate,
        delivery: order.delivery,
        quantity: order.quantity,
        total: order.total,
        status: order.status,
      })),
      [
        { key: "id", label: "Order ID" },
        { key: "customer", label: "Customer" },
        { key: "orderDate", label: "Order date" },
        { key: "delivery", label: "Delivery date" },
        { key: "quantity", label: "Quantity" },
        { key: "total", label: "Total ($)" },
        { key: "status", label: "Status" },
      ]
    );
    dispatch(
      showToast({
        tone: ok ? "success" : "error",
        message: ok ? "Orders CSV downloaded." : "No orders in this month.",
      })
    );
  }

  function exportExpenses() {
    const ok = exportCsv(
      `agricore-expenses-${report.month}.csv`,
      report.expenses.map((entry) => ({
        id: entry.id,
        date: entry.date,
        category: entry.category,
        amount: entry.amount,
        note: entry.note || "",
      })),
      [
        { key: "id", label: "ID" },
        { key: "date", label: "Date" },
        { key: "category", label: "Category" },
        { key: "amount", label: "Amount ($)" },
        { key: "note", label: "Note" },
      ]
    );
    dispatch(
      showToast({
        tone: ok ? "success" : "error",
        message: ok ? "Expenses CSV downloaded." : "No expenses in this month.",
      })
    );
  }

  if (!month) {
    return (
      <Card title="Monthly Report" subtitle="Select a month to generate the report">
        <EmptyState
          title="No data yet"
          text="Once orders, expenses or cuttings exist, monthly reports will appear here."
        />
      </Card>
    );
  }

  const kpis = [
    { label: "Harvest", value: `${formatNumber(report.harvest)} kg`, note: `${report.harvestCount} cuttings` },
    { label: "Sales quantity", value: `${formatNumber(report.salesQuantity)} kg`, note: `${report.orderCount} orders` },
    { label: "Revenue", value: formatMoney(report.revenue), note: "Confirmed orders" },
    { label: "Expenses", value: formatMoney(report.expense), note: `${report.expenseCount} entries` },
    {
      label: "Net profit",
      value: formatMoney(report.profit),
      note: report.profit >= 0 ? "Revenue above expenses" : "Loss-making month",
    },
  ];

  return (
    <Card
      title="Monthly Report"
      subtitle="Harvest, sales and expenses in one place"
      action={
        <div className="crop-toolbar">
          <button type="button" className="btn btn--ghost" onClick={exportOrders}>
            <IconDownload size={15} /> Orders CSV
          </button>
          <button type="button" className="btn btn--ghost" onClick={exportExpenses}>
            <IconDownload size={15} /> Expenses CSV
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => window.print()}>
            <IconPrint size={15} /> Print / PDF
          </button>
        </div>
      }
    >
      <div className="summary-kpis report-kpis">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`summary-kpi ${
              kpi.label === "Net profit"
                ? report.profit >= 0
                  ? "summary-kpi--positive"
                  : "summary-kpi--negative"
                : ""
            }`.trim()}
          >
            <span className="summary-kpi__label">{kpi.label}</span>
            <b>{kpi.value}</b>
            <small className="cell-sub">{kpi.note}</small>
          </div>
        ))}
      </div>

      <div className="report-block">
        <h4 className="report-block__title">
          <IconFileText size={16} /> Orders this month
        </h4>
        {report.orders.length === 0 ? (
          <p className="muted small">No orders in this month.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {report.orders.map((order) => (
                  <tr key={order.id}>
                    <td className="nowrap">{order.id}</td>
                    <td>{order.customer}</td>
                    <td className="nowrap">{formatDate(order.orderDate)}</td>
                    <td className="nowrap">{formatNumber(order.quantity)} {order.unit}</td>
                    <td className="nowrap"><b>{formatMoney(order.total)}</b></td>
                    <td><StatusBadge>{order.status}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="report-block">
        <h4 className="report-block__title">Expenses this month</h4>
        {report.expenses.length === 0 ? (
          <p className="muted small">No expenses in this month.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {report.expenses.map((entry) => (
                  <tr key={entry.id}>
                    <td className="nowrap">{formatDate(entry.date)}</td>
                    <td>{entry.category}</td>
                    <td className="nowrap"><b>{formatMoney(entry.amount)}</b></td>
                    <td className="muted">{entry.note || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
