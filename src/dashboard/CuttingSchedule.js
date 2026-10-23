import { useSelector } from "react-redux";
import { selectCuttingSchedule } from "../store/selectors/selectDueCrops";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { formatDate, formatNumber } from "../utils/formatters";

function daysLabel(row) {
  if (row.daysRemaining === null) return "—";
  if (row.daysRemaining < 0) return `${Math.abs(row.daysRemaining)} days overdue`;
  if (row.daysRemaining === 0) return "Today";
  return `${row.daysRemaining} days`;
}

export default function CuttingSchedule() {
  const rows = useSelector(selectCuttingSchedule);

  return (
    <Card
      title="Crop Cutting Schedule"
      subtitle="Upcoming and overdue harvest cuttings"
      action={
        <StatusBadge tone={rows.some((r) => r.state === "Overdue") ? "red" : "green"}>
          {rows.length} scheduled
        </StatusBadge>
      }
    >
      {rows.length === 0 ? (
        <EmptyState
          title="No cuttings scheduled"
          text="Add a cutting date to a crop to see it here."
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Field</th>
                <th>Cutting date</th>
                <th>Days remaining</th>
                <th>Expected harvest</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={
                    row.state === "Overdue"
                      ? "row--overdue"
                      : row.state === "Due soon"
                        ? "row--due"
                        : undefined
                  }
                >
                  <td>
                    <span className="cell-title">{row.name}</span>
                    <span className="cell-sub">{row.healthStatus}</span>
                  </td>
                  <td>{row.field}</td>
                  <td className="nowrap">{formatDate(row.cuttingDate)}</td>
                  <td className="nowrap">{daysLabel(row)}</td>
                  <td className="nowrap">
                    <b>{formatNumber(row.harvestQty)}</b> kg
                  </td>
                  <td>
                    <StatusBadge>{row.state}</StatusBadge>
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
