import { useSelector } from "react-redux";
import { selectStockRows } from "../store/selectors/cropSelectors";
import Card from "../common/Card";
import Progress from "../common/Progress";
import StatusBadge from "../common/StatusBadge";
import EmptyState from "../common/EmptyState";
import { formatNumber } from "../utils/formatters";

export default function StockProgressBar() {
  const rows = useSelector(selectStockRows);

  return (
    <Card
      title="Stock Progress"
      subtitle="Available stock left against total harvest"
    >
      {rows.length === 0 ? (
        <EmptyState title="No crops" text="Add crops to track their stock." />
      ) : (
        <div className="production-list">
          {rows.map((row) => (
            <div
              className={`production-row ${row.remainingPercent <= 20 ? "production-row--low" : ""}`.trim()}
              key={row.id}
            >
              <div className="production-row__top">
                <span className="cell-title">{row.name}</span>
                {row.remainingPercent <= 20 ? (
                  <StatusBadge tone="amber">Low stock</StatusBadge>
                ) : (
                  <span className="cell-sub">
                    {formatNumber(row.sold)} sold
                  </span>
                )}
              </div>
              <Progress
                value={row.remainingPercent}
                label={`${formatNumber(row.available)} / ${formatNumber(row.harvestQty)} ${row.unit}`}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
