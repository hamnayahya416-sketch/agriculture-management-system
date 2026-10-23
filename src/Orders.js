import { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Badge, Card, EmptyState, PageHeader, Stat } from "./ui";
import { IconCart, IconCheckCircle, IconPlus, IconTrend, IconUsers } from "./icons";

const COLORS = {
  Pending: "#F59E0B",
  Processing: "#0EA5E9",
  Packed: "#7C3AED",
  Delivered: "#166534",
  Cancelled: "#DC2626",
};

export default function Orders({ orders, onNewOrder }) {
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Pending", "Processing", "Packed", "Delivered"];
  const visible = orders.filter(
    (order) => filter === "All" || order.status === filter
  );

  const delivered = orders.filter((o) => o.status === "Delivered");
  const active = orders.length - delivered.length;
  const revenue = delivered.reduce((sum, o) => sum + o.total, 0);

  const statusData = filters.slice(1).map((status) => ({
    name: status,
    value: orders.filter((o) => o.status === status).length,
  }));

  const customers = Object.values(
    orders.reduce((map, order) => {
      if (!map[order.customer]) {
        map[order.customer] = {
          name: order.customer,
          email: order.email,
          phone: order.phone,
          orders: 0,
          crops: new Set(),
        };
      }
      map[order.customer].orders += 1;
      map[order.customer].crops.add(order.crop);
      return map;
    }, {})
  );

  return (
    <>
      <PageHeader
        title="Orders"
        description="Customer orders, the crops delivered to them and the current order status."
        action={
          <button type="button" className="btn" onClick={onNewOrder}>
            <IconPlus size={16} />
            New Order
          </button>
        }
      />

      <div className="stats-row">
        <Stat
          icon={<IconCart size={20} />}
          label="Total orders"
          value={orders.length}
          note="All time"
        />
        <Stat
          icon={<IconTrend size={20} />}
          tone="blue"
          label="Active orders"
          value={active}
          note="Not delivered yet"
        />
        <Stat
          icon={<IconCheckCircle size={20} />}
          label="Delivered"
          value={delivered.length}
          note="Completed orders"
        />
        <Stat
          icon={<IconUsers size={20} />}
          tone="slate"
          label="Delivered value"
          value={`$${revenue.toLocaleString()}`}
          note="Revenue received"
        />
      </div>

      <div className="grid">
        <div className="span-8">
          <Card
            title="Order Records"
            subtitle="Every order with its customer and delivery details"
            action={
              <div className="chip-row">
                {filters.map((name) => (
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
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => setFilter("All")}
                  >
                    Show all orders
                  </button>
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
                        <td>{order.crop}</td>
                        <td className="nowrap">
                          {order.quantity.toLocaleString()} {order.unit}
                        </td>
                        <td className="nowrap">{order.delivery}</td>
                        <td className="nowrap">
                          <b>${order.total.toLocaleString()}</b>
                        </td>
                        <td>
                          <Badge>{order.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="span-4">
          <Card title="Order Status" subtitle="Orders by current status">
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    isAnimationActive={false}
                  >
                    {statusData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="span-12">
          <Card
            title="Customers"
            subtitle="People and companies that placed orders"
          >
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Orders</th>
                    <th>Crops ordered</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.name}>
                      <td>
                        <span className="cell-title">{customer.name}</span>
                      </td>
                      <td>{customer.email}</td>
                      <td className="nowrap">{customer.phone}</td>
                      <td>{customer.orders}</td>
                      <td>{Array.from(customer.crops).join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
