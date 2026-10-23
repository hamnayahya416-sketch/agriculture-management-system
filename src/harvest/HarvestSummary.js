import { useSelector } from "react-redux";
import { selectHarvestSummary } from "../store/selectors/summarySelectors";
import Card from "../common/Card";
import { formatNumber, formatTonnes } from "../utils/formatters";
import { IconBox, IconSprout, IconTrend, IconCheckCircle } from "../common/icons";

export default function HarvestSummary() {
  const summary = useSelector(selectHarvestSummary);

  return (
    <Card title="Harvest Summary" subtitle="Season totals from the crop records">
      <div className="summary-kpis">
        <div className="summary-kpi">
          <span className="summary-kpi__icon">
            <IconSprout size={18} />
          </span>
          <span className="summary-kpi__label">Total harvest</span>
          <b>{formatNumber(summary.totalHarvest)} kg</b>
          <small className="cell-sub">{formatTonnes(summary.totalHarvest)} across {summary.cropCount} crops</small>
        </div>

        <div className="summary-kpi">
          <span className="summary-kpi__icon summary-kpi__icon--blue">
            <IconTrend size={18} />
          </span>
          <span className="summary-kpi__label">Quantity sold</span>
          <b>{formatNumber(summary.quantitySold)} kg</b>
          <small className="cell-sub">Orders + buyer purchases</small>
        </div>

        <div className="summary-kpi">
          <span className="summary-kpi__icon summary-kpi__icon--amber">
            <IconBox size={18} />
          </span>
          <span className="summary-kpi__label">Quantity remaining</span>
          <b>{formatNumber(summary.quantityRemaining)} kg</b>
          <small className="cell-sub">Still in the store</small>
        </div>

        <div className="summary-kpi">
          <span className="summary-kpi__icon summary-kpi__icon--violet">
            <IconCheckCircle size={18} />
          </span>
          <span className="summary-kpi__label">Crops tracked</span>
          <b>{summary.cropCount}</b>
          <small className="cell-sub">With cutting schedules</small>
        </div>
      </div>
    </Card>
  );
}
