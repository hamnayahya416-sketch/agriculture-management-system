import { useState } from "react";
import PageHeader from "../common/PageHeader";
import CropForm from "../crops/CropForm";
import CropTable from "../crops/CropTable";
import { IconPlus } from "../common/icons";

export default function Crops() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  function startAdd() {
    setEditing(null);
    setShowForm(true);
  }

  function startEdit(crop) {
    setEditing(crop);
    setShowForm(true);
  }

  function done() {
    setShowForm(false);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Crops"
        description="Full crop CRUD with health scores, cutting dates and stock."
        action={
          <button type="button" className="btn" onClick={startAdd}>
            <IconPlus size={16} />
            Add crop
          </button>
        }
      />

      <div className="grid">
        <div className="span-12">
          {showForm ? (
            <CropForm crop={editing} onDone={done} />
          ) : (
            <CropTable onEdit={startEdit} />
          )}
        </div>
      </div>
    </>
  );
}
