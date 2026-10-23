import { useSelector } from "react-redux";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import { selectUsageRows } from "../store/selectors/selectLowStock";
import { formatDate, formatNumber } from "../utils/formatters";

export default function UsageTable() {
  const usage = useSelector(selectUsageRows);

  return (
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
  );
}
