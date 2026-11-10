import { useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader.js";
import BuyerForm from "../components/buyers/BuyerForm.js";
import BuyerTable from "../components/buyers/BuyerTable.js";
import { selectCanModify } from "../redux/selectors/entitySelectors.js";
import { IconPlus, IconShield } from "../components/common/icons.js";

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
