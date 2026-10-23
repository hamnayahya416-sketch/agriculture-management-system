import { useState } from "react";
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
import { Badge, Card, EmptyState, PageHeader, Stat } from "./ui";
import { deliveries, stockByCategory, supplies } from "./data";
import { IconAlert, IconBox, IconCheckCircle, IconSearch, IconTruck } from "./icons";

function stockStatus(item) {
  if (item.stock === 0) return "Out of stock";
  if (item.stock < item.min) return "Low stock";
  return "In stock";
}

export default function Supplies() {
  const [query, setQuery] = useState("");

  const lowCount = supplies.filter((item) => item.stock < item.min).length;
  const incoming = deliveries.filter((d) => d.status !== "Received").length;

  const q = query.trim().toLowerCase();
  const visible = supplies.filter((item) =>
    [item.item, item.category, item.supplier].some((field) =>
      field.toLowerCase().includes(q)
    )
  );

  return (
    <>
      <PageHeader
        title="Supplies"
        description="Seeds, fertilizers, irrigation parts and packaging held in store, plus incoming deliveries."
      />

      <div className="stats-row">
        <Stat
          icon={<IconBox size={20} />}
          label="Supply items"
          value={supplies.length}
          note="Across 5 categories"
        />
        <Stat
          icon={<IconAlert size={20} />}
          tone="amber"
          label="Needs restock"
          value={lowCount}
          note="Below minimum stock"
        />
        <Stat
          icon={<IconTruck size={20} />}
          tone="blue"
          label="Incoming deliveries"
          value={incoming}
          note="Ordered or in transit"
        />
        <Stat
          icon={<IconCheckCircle size={20} />}
          label="Received deliveries"
          value={deliveries.length - incoming}
          note="Landed this month"
        />
      </div>

      <div className="grid">
        <div className="span-7">
          <Card
            title="Inventory"
            subtitle="Stock level of every supply item"
            action={
              <div className="search search--sm">
                <IconSearch size={15} />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search supplies…"
                  aria-label="Search supplies"
                />
              </div>
            }
          >
            {visible.length === 0 ? (
              <EmptyState
                title="No supplies found"
                text={`Nothing matches “${query}”. Try another keyword.`}
              />
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Supplier</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <span className="cell-title">{item.item}</span>
                          <span className="cell-sub">SKU {item.id}</span>
                        </td>
                        <td>{item.category}</td>
                        <td>{item.supplier}</td>
                        <td className="nowrap">
                          <b>{item.stock.toLocaleString()}</b> {item.unit}
                          <span className="cell-sub">min {item.min}</span>
                        </td>
                        <td>
                          <Badge>{stockStatus(item)}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="span-5">
          <Card
            title="Stock by Category"
            subtitle="Units available per category"
          >
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockByCategory}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    name="Units in store"
                    fill="#166534"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="span-12">
          <Card
            title="Supply Deliveries"
            subtitle="Orders placed with our suppliers"
          >
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Delivery ID</th>
                    <th>Item</th>
                    <th>Supplier</th>
                    <th>Expected date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id}>
                      <td>
                        <span className="cell-title">{delivery.id}</span>
                      </td>
                      <td>{delivery.item}</td>
                      <td>{delivery.supplier}</td>
                      <td className="nowrap">{delivery.date}</td>
                      <td>
                        <Badge>{delivery.status}</Badge>
                      </td>
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
