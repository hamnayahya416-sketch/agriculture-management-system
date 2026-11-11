import { useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader.js";
import StatCard from "../components/common/StatCard.js";
import ServiceForm from "../components/maintenance/ServiceForm.js";
import ServiceTable from "../components/maintenance/ServiceTable.js";
import { selectMaintenanceItems } from "../redux/selectors/entitySelectors.js";
import {
  selectMaintenanceStats,
  selectServiceDue,
} from "../redux/selectors/workforceSelectors.js";
import { formatMoney, todayIso } from "../utils/formatters.js";
import useRole from "../hooks/useRole.js";
import {
  IconPlus,
  IconShield,
  IconRefresh,
  IconWallet,
  IconCalendarCheck,
  IconClock,
} from "../components/common/icons.js";

export default function Maintenance() {
  const { canAdd } = useRole();
  const services = useSelector(selectMaintenanceItems);
  const stats = useSelector(selectMaintenanceStats);
  const dueSoon = useSelector((state) => selectServiceDue(state, 14));
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const servicedThisMonth = new Set(
    services
      .filter((entry) => String(entry.date || "").slice(0, 7) === todayIso().slice(0, 7))
      .map((entry) => String(entry.equipmentId))
  ).size;

  function startAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(entry) {
    setEditing(entry);
    setShowForm(true);
  }

  function done() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Maintenance"
        description="Service history, repair costs and upcoming service dates."
        action={
          canAdd ? (
            <button type="button" className="btn" onClick={startAdd}>
              <IconPlus size={16} />
              Log Service
            </button>
          ) : (
            <span className="role-note">
              <IconShield size={14} /> View only
            </span>
          )
        }
      />

      <div className="stats-row">
        <StatCard
          icon={<IconRefresh size={20} />}
          tone="slate"
          label="Service records"
          value={stats.count}
          note="Logged against equipment"
        />
        <StatCard
          icon={<IconWallet size={20} />}
          label="Total cost"
          value={formatMoney(stats.totalCost)}
          note="All time maintenance spend"
        />
        <StatCard
          icon={<IconCalendarCheck size={20} />}
          tone="blue"
          label="This month"
          value={formatMoney(stats.thisMonthCost)}
          note={`${servicedThisMonth} machine(s) serviced`}
        />
        <StatCard
          icon={<IconClock size={20} />}
          tone="amber"
          label="Service due"
          value={dueSoon.length}
          note="Within the next 14 days"
        />
      </div>

      <div className="grid">
        <div className="span-12">
          {showForm && canAdd && <ServiceForm service={editing} onDone={done} />}
        </div>

        <div className="span-12">
          <ServiceTable onEdit={startEdit} />
        </div>
      </div>
    </>
  );
}
