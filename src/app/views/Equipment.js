import { useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader.js";
import StatCard from "../components/common/StatCard.js";
import EquipmentForm from "../components/equipment/EquipmentForm.js";
import EquipmentTable from "../components/equipment/EquipmentTable.js";
import { selectEquipmentItems } from "../redux/selectors/entitySelectors.js";
import { selectServiceDue } from "../redux/selectors/workforceSelectors.js";
import useRole from "../hooks/useRole.js";
import {
  IconPlus,
  IconShield,
  IconTruck,
  IconCheckCircle,
  IconAlert,
  IconClock,
} from "../components/common/icons.js";

export default function Equipment() {
  const { canAdd } = useRole();
  const equipment = useSelector(selectEquipmentItems);
  const dueSoon = useSelector((state) => selectServiceDue(state, 14));
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const operational = equipment.filter((item) => item.status === "Operational").length;
  const underRepair = equipment.filter((item) => item.status === "Under Repair").length;

  function startAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(item) {
    setEditing(item);
    setShowForm(true);
  }

  function done() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Equipment"
        description="Tractors, harvesters and pumps — status and service schedule."
        action={
          canAdd ? (
            <button type="button" className="btn" onClick={startAdd}>
              <IconPlus size={16} />
              Add Equipment
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
          icon={<IconTruck size={20} />}
          tone="slate"
          label="Total equipment"
          value={equipment.length}
          note="Machines on the farm"
        />
        <StatCard
          icon={<IconCheckCircle size={20} />}
          label="Operational"
          value={operational}
          note="Ready to work"
        />
        <StatCard
          icon={<IconAlert size={20} />}
          tone="amber"
          label="Under repair"
          value={underRepair}
          note="In the workshop"
        />
        <StatCard
          icon={<IconClock size={20} />}
          tone="blue"
          label="Service due"
          value={dueSoon.length}
          note="Within the next 14 days"
        />
      </div>

      <div className="grid">
        <div className="span-12">
          {showForm && canAdd && <EquipmentForm equipment={editing} onDone={done} />}
        </div>

        <div className="span-12">
          <EquipmentTable onEdit={startEdit} />
        </div>
      </div>
    </>
  );
}
