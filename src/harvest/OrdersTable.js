import { useState } from "react";
import { useSelector } from "react-redux";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import { selectOrderItems } from "../store/selectors/entitySelectors";
import { selectAllCrops } from "../store/selectors/cropSelectors";
import { formatNumber, formatMoney, formatDate } from "../utils/formatters";

const FILTERS = ["All", "Pending", "Processing", "Packed", "Delivered", "Cancelled"];

export default function OrdersTable() {
  const orders = useSelector(selectOrderItems);
  const crops = useSelector(selectAllCrops);
  const [filter, setFilter] = useState("All");

  const cropNames = {};
  crops.forEach((crop) => {
    cropNames[crop.id] = crop.name;
  });

  const visible = orders.filter(
    (order) => filter === "All" || order.status === filter
  );

  return (
    <Card
      title="Orders"
      subtitle="Every customer order with crop, quantity and status"
      action={
        <div className="chip-row">
          {FILTERS.map((name) => (
            <button
              key={name}
              type="button"
              className={`chip ${filter === name ? "is-active" : ""}`.trim()}
              onClick={() => setFilter(name)}
              aria-pressed={filter === name}
            >
              {name}
            </button>
          ))}
        </div>
      }
    >
      {visible.length === 0 ? (
        <EmptyState
          title="No orders found"
          text={`There are no ${filter.toLowerCase()} orders right now.`}
          action={
            filter !== "All" ? (
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setFilter("All")}
              >
                Show all orders
              </button>
            ) : null
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Crop</th>
                <th>Quantity</th>
                <th>Order date</th>
                <th>Delivery</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="cell-title">{order.id}</span>
                  </td>
                  <td>
                    <span className="cell-title">{order.customer}</span>
                    <span className="cell-sub">{order.email}</span>
                  </td>
                  <td>{cropNames[order.cropId] || "—"}</td>
                  <td className="nowrap">
                    {formatNumber(order.quantity)} {order.unit}
                  </td>
                  <td className="nowrap">{formatDate(order.orderDate)}</td>
                  <td className="nowrap">{formatDate(order.delivery)}</td>
                  <td className="nowrap">
                    <b>{formatMoney(order.total)}</b>
                  </td>
                  <td>
                    <StatusBadge>{order.status}</StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
