import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../common/PageHeader";
import StatCard from "../common/StatCard";
import MonthlyReport from "../reports/MonthlyReport";
import ProfitLossChart from "../reports/ProfitLossChart";
import ActivityLog from "../reports/ActivityLog";
import { selectAvailableMonths } from "../store/selectors/reportSelectors";
import { selectProfitTotals } from "../store/selectors/selectProfitByCrop";
import { selectActivityItems } from "../store/selectors/entitySelectors";
import { formatMoney } from "../utils/formatters";
import {
  IconTrend,
  IconWallet,
  IconPlus,
  IconClock,
} from "../common/icons";

export default function Reports() {
  const months = useSelector(selectAvailableMonths);
  const totals = useSelector(selectProfitTotals);
  const activity = useSelector(selectActivityItems);
  const [month, setMonth] = useState("");

  useEffect(() => {
    if (!month && months.length > 0) setMonth(months[0].value);
  }, [months, month]);

  return (
    <>
      <PageHeader
        title="Reports & Activity"
        description="Monthly reports with CSV/PDF export and the full activity log."
        action={
          months.length > 0 ? (
            <label className="field field--inline">
              <span>Report month</span>
              <select
                className="toolbar-select"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                aria-label="Report month"
              >
                {months.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null
        }
      />

      <div className="stats-row">
        <StatCard
          icon={<IconTrend size={20} />}
          label="Total revenue"
          value={formatMoney(totals.revenue)}
          note="All confirmed orders"
        />
        <StatCard
          icon={<IconWallet size={20} />}
          tone="amber"
          label="Total expenses"
          value={formatMoney(totals.expense)}
          note="All recorded spending"
        />
        <StatCard
          icon={<IconPlus size={20} />}
          tone={totals.profit >= 0 ? "green" : "slate"}
          label="Net profit"
          value={formatMoney(totals.profit)}
          note={totals.profit >= 0 ? "Revenue above expenses" : "Expenses above revenue"}
        />
        <StatCard
          icon={<IconClock size={20} />}
          tone="blue"
          label="Activity entries"
          value={activity.length}
          note="Recorded user actions"
        />
      </div>

      <div className="grid">
        <div className="span-12">
          <MonthlyReport month={month} />
        </div>

        <div className="span-12">
          <ProfitLossChart />
        </div>

        <div className="span-12">
          <ActivityLog />
        </div>
      </div>
    </>
  );
}
