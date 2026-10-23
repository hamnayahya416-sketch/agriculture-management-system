import { useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../common/PageHeader";
import StatCard from "../common/StatCard";
import ItemForm from "../inventory/ItemForm";
import UsageForm from "../inventory/UsageForm";
import InventoryTable from "../inventory/InventoryTable";
import UsageTable from "../inventory/UsageTable";
import InventoryChart from "../inventory/InventoryChart";
import {
  selectInventoryItems,
  selectCanModify,
} from "../store/selectors/entitySelectors";
import {
  selectLowStock,
  selectLowStockCount,
  selectUsageRows,
} from "../store/selectors/selectLowStock";
import { formatNumber } from "../utils/formatters";
import { IconAlert, IconBox, IconPlus, IconSearch, IconShield } from "../common/icons";

export default function Inventory() {
  const items = useSelector(selectInventoryItems);
  const lowStock = useSelector(selectLowStock);
  const lowCount = useSelector(selectLowStockCount);
  const usage = useSelector(selectUsageRows);
  const canModify = useSelector(selectCanModify);

  const [formMode, setFormMode] = useState(null); // null | "item" | "usage"
  const [editing, setEditing] = useState(null);

  const totalUnits = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);

  function startAddItem() {
    setEditing(null);
    setFormMode("item");
  }

  function startEditItem(item) {
    setEditing(item);
    setFormMode("item");
  }

  function done() {
    setFormMode(null);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Inputs Inventory"
        description="Fertilizer, pesticide and seed stock with minimum-level warnings."
        action={
          canModify ? (
            <div className="page-head__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setFormMode(formMode === "usage" ? null : "usage")}
              >
                <IconSearch size={15} />
                {formMode === "usage" ? "Hide usage form" : "Log Usage"}
              </button>
              <button type="button" className="btn" onClick={startAddItem}>
                <IconPlus size={16} />
                Add Item
              </button>
            </div>
          ) : (
            <span className="role-note">
              <IconShield size={14} /> View only
            </span>
          )
        }
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
        {formMode === "item" && canModify && (
          <div className="span-12">
            <ItemForm item={editing} onDone={done} />
          </div>
        )}
        {formMode === "usage" && canModify && (
          <div className="span-12">
            <UsageForm onDone={done} />
          </div>
        )}

        <div className="span-7">
          <InventoryTable onEdit={startEditItem} />
        </div>

        <div className="span-5">
          <InventoryChart />
        </div>

        <div className="span-12">
          <UsageTable />
        </div>
      </div>
    </>
  );
}
