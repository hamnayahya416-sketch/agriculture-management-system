import { useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../common/PageHeader";
import BuyerForm from "../buyers/BuyerForm";
import BuyerTable from "../buyers/BuyerTable";
import { selectCanModify } from "../store/selectors/entitySelectors";
import { IconPlus, IconShield } from "../common/icons";

export default function Buyers() {
  const canModify = useSelector(selectCanModify);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  function startAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(buyer) {
    setEditing(buyer);
    setShowForm(true);
  }

  function done() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Buyers"
        description="Register buyers with photos and CNIC details."
        action={
          canModify ? (
            <button type="button" className="btn" onClick={startAdd}>
              <IconPlus size={16} />
              Add Buyer
            </button>
          ) : (
            <span className="role-note">
              <IconShield size={14} /> View only
            </span>
          )
        }
      />

      {showForm && (
        <BuyerForm buyer={editing} onDone={done} />
      )}

      <BuyerTable onEdit={startEdit} />
    </>
  );
}
