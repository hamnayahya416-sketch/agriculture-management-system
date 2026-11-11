import { useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader.js";
import StatCard from "../components/common/StatCard.js";
import WorkerForm from "../components/workers/WorkerForm.js";
import WorkerTable from "../components/workers/WorkerTable.js";
import { selectWorkerItems } from "../redux/selectors/entitySelectors.js";
import { selectWorkersPresentToday, selectWagesPayable } from "../redux/selectors/workforceSelectors.js";
import { formatMoney } from "../utils/formatters.js";
import useRole from "../hooks/useRole.js";
import {
  IconPlus,
  IconShield,
  IconUsers,
  IconCheckCircle,
  IconCalendarCheck,
  IconWallet,
} from "../components/common/icons.js";

export default function Workers() {
  const { canAdd } = useRole();
  const workers = useSelector(selectWorkerItems);
  const presentToday = useSelector(selectWorkersPresentToday);
  const wagesPayable = useSelector(selectWagesPayable);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const active = workers.filter((worker) => worker.status === "Active").length;

  function startAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(worker) {
    setEditing(worker);
    setShowForm(true);
  }

  function done() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Workers"
        description="Crew members, daily wages and how many showed up today."
        action={
          canAdd ? (
            <button type="button" className="btn" onClick={startAdd}>
              <IconPlus size={16} />
              Add Worker
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
          icon={<IconUsers size={20} />}
          tone="slate"
          label="Total workers"
          value={workers.length}
          note="On the farm roll"
        />
        <StatCard
          icon={<IconCheckCircle size={20} />}
          label="Active"
          value={active}
          note="Currently working"
        />
        <StatCard
          icon={<IconCalendarCheck size={20} />}
          tone="blue"
          label="Present today"
          value={presentToday.length}
          note="Marked present today"
        />
        <StatCard
          icon={<IconWallet size={20} />}
          tone="amber"
          label="Wages payable"
          value={formatMoney(wagesPayable)}
          note="For everyone present"
        />
      </div>

      <div className="grid">
        <div className="span-12">
          {showForm && canAdd && <WorkerForm worker={editing} onDone={done} />}
        </div>

        <div className="span-12">
          <WorkerTable onEdit={startEdit} />
        </div>
      </div>
    </>
  );
}
