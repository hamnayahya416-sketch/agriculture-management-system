import { useState } from "react";
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
import PageHeader from "../common/PageHeader";
import StatCard from "../common/StatCard";
import Card from "../common/Card";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import SearchBar from "../common/SearchBar";
import {
  selectInventoryItems,
} from "../store/selectors/entitySelectors";
import {
  selectLowStock,
  selectLowStockCount,
  selectInventoryTypeCounts,
  selectUsageRows,
  selectStockStatus,
} from "../store/selectors/selectLowStock";
import useDebounce from "../hooks/useDebounce";
import { formatNumber, formatDate } from "../utils/formatters";
import { IconAlert, IconBox, IconSearch } from "../common/icons";

export default function Inventory() {
  const items = useSelector(selectInventoryItems);
  const lowStock = useSelector(selectLowStock);
  const lowCount = useSelector(selectLowStockCount);
  const typeCounts = useSelector(selectInventoryTypeCounts);
  const usage = useSelector(selectUsageRows);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const q = debouncedQuery.trim().toLowerCase();
  const visible = items.filter((item) =>
    [item.item, item.type, item.supplier || ""].some((field) =>
      field.toLowerCase().includes(q)
    )
  );

  const totalUnits = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  return (
    <>
      <PageHeader
        title="Inputs Inventory"
        description="Fertilizer, pesticide and seed stock with minimum-level warnings."
      />

      <div className="stats-row">
        <StatCard
          icon={<IconBox size={20} />}
          label="Supply items"
          value={items.length}
          note={`${formatNumber(totalUnits)} total units in store`}
        />
        <StatCard
          icon={<IconAlert size={20} />}
          tone="amber"
          label="Needs restock"
          value={lowCount}
          note="At or below minimum quantity"
        />
        <StatCard
          icon={<IconSearch size={20} />}
          tone="blue"
          label="Usage records"
          value={usage.length}
          note="Inputs consumed this season"
        />
        <StatCard
          icon={<IconBox size={20} />}
          tone="slate"
          label="Out of stock"
          value={items.filter((item) => (Number(item.qty) || 0) === 0).length}
          note="Items with zero quantity"
        />
      </div>

      {lowStock.length > 0 && (
        <div className="notice" role="status">
          <IconAlert size={18} />
          <p>
            <b>Restock needed:</b> {lowStock.map((item) => item.item).join(", ")}.
          </p>
        </div>
      )}

      <div className="grid">
        <div className="span-7">
          <Card
            title="Inventory"
            subtitle="Stock level of every input"
            action={
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Search supplies…"
                label="Search supplies"
              />
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
                      <th>Type</th>
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
                          <span className="cell-sub">{item.id}</span>
                        </td>
                        <td>{item.type}</td>
                        <td>{item.supplier || "—"}</td>
                        <td className="nowrap">
                          <b>{formatNumber(item.qty)}</b> {item.unit}
                          <span className="cell-sub">min {item.minQty}</span>
                        </td>
                        <td>
                          <StatusBadge>{selectStockStatus(item)}</StatusBadge>
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
          <Card title="Stock by Type" subtitle="Units available per input type">
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeCounts}>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="var(--border)"
                    vertical={false}
                  />
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
          <Card title="Usage History" subtitle="Inputs consumed, most recent first">
            {usage.length === 0 ? (
              <EmptyState title="No usage recorded" text="Consumed inputs will appear here." />
            ) : (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Item</th>
                      <th>Quantity used</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usage.map((entry) => (
                      <tr key={entry.id}>
                        <td className="nowrap">{formatDate(entry.date)}</td>
                        <td>
                          <span className="cell-title">{entry.itemName}</span>
                          <span className="cell-sub">{entry.itemId}</span>
                        </td>
                        <td className="nowrap">
                          <b>{formatNumber(entry.qty)}</b> {entry.unit}
                        </td>
                        <td>{entry.note || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
