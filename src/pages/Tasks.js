import { useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../common/PageHeader";
import StatCard from "../common/StatCard";
import TaskForm from "../tasks/TaskForm";
import TaskTable from "../tasks/TaskTable";
import { selectTaskRows } from "../store/selectors/taskSelectors";
import { selectCanModify } from "../store/selectors/entitySelectors";
import { IconCheckCircle, IconClock, IconPlus, IconShield, IconAlert } from "../common/icons";

export default function Tasks() {
  const canModify = useSelector(selectCanModify);
  const rows = useSelector(selectTaskRows);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const pending = rows.filter((row) => row.computedStatus === "Pending").length;
  const done = rows.filter((row) => row.computedStatus === "Done").length;
  const overdue = rows.filter((row) => row.computedStatus === "Overdue").length;

  function startAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(task) {
    setEditing(task);
    setShowForm(true);
  }

  function finish() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Farm Tasks"
        description="Schedule irrigation, fertilizer, spraying and labour work."
        action={
          canModify ? (
            <button type="button" className="btn" onClick={startAdd}>
              <IconPlus size={16} />
              Schedule Task
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
          icon={<IconClock size={20} />}
          label="Pending"
          value={pending}
          note="Open tasks waiting"
        />
        <StatCard
          icon={<IconCheckCircle size={20} />}
          tone="green"
          label="Completed"
          value={done}
          note="Marked done"
        />
        <StatCard
          icon={<IconAlert size={20} />}
          tone="amber"
          label="Overdue"
          value={overdue}
          note="Past their due date"
        />
        <StatCard
          icon={<IconClock size={20} />}
          tone="slate"
          label="Total tasks"
          value={rows.length}
          note="All scheduled work"
        />
      </div>

      <div className="grid">
        <div className="span-12">
          {showForm && canModify && <TaskForm task={editing} onDone={finish} />}
        </div>

        <div className="span-12">
          <TaskTable onEdit={startEdit} />
        </div>
      </div>
    </>
  );
}
