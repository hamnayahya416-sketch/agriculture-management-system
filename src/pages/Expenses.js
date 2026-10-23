import { useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../common/PageHeader";
import StatCard from "../common/StatCard";
import ExpenseForm from "../expenses/ExpenseForm";
import ExpenseTable from "../expenses/ExpenseTable";
import ExpenseCategoryChart from "../expenses/ExpenseCategoryChart";
import { selectCanModify, selectExpenseItems } from "../store/selectors/entitySelectors";
import { formatMoney, todayIso } from "../utils/formatters";
import { IconPlus, IconShield, IconWallet } from "../common/icons";

export default function Expenses() {
  const canModify = useSelector(selectCanModify);
  const expenses = useSelector(selectExpenseItems);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const total = expenses.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  const thisMonth = expenses
    .filter((entry) => String(entry.date || "").slice(0, 7) === todayIso().slice(0, 7))
    .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);

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
        title="Expenses"
        description="Every rupee spent on the farm, by crop and category."
        action={
          canModify ? (
            <button type="button" className="btn" onClick={startAdd}>
              <IconPlus size={16} />
              Record Expense
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
          icon={<IconWallet size={20} />}
          label="Total expenses"
          value={formatMoney(total)}
          note={`${expenses.length} records`}
        />
        <StatCard
          icon={<IconWallet size={20} />}
          tone="amber"
          label="This month"
          value={formatMoney(thisMonth)}
          note="Current calendar month"
        />
      </div>

      <div className="grid">
        <div className="span-12">
          {showForm && canModify && (
            <ExpenseForm expense={editing} onDone={done} />
          )}
        </div>

        <div className="span-7">
          <ExpenseTable onEdit={startEdit} />
        </div>

        <div className="span-5">
          <ExpenseCategoryChart />
        </div>
      </div>
    </>
  );
}
