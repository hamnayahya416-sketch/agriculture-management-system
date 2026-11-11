import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card.js";
import StatusBadge from "../common/StatusBadge.js";
import EmptyState from "../common/EmptyState.js";
import ConfirmModal from "../common/ConfirmModal.js";
import { selectAttendanceItems, selectWorkerItems } from "../../redux/selectors/entitySelectors.js";
import { REMOVEATTENDANCE } from "../../redux/actions/attendance/index.js";
import { showToast } from "../../redux/actions/ui/index.js";
import { formatDate } from "../../utils/formatters.js";
import useRole from "../../hooks/useRole.js";
import { IconTrash } from "../common/icons.js";

const STATUS_TONES = { Present: "green", Absent: "red", Leave: "amber" };

export default function AttendanceTable({ date }) {
  const dispatch = useDispatch();
  const { canDelete } = useRole();
  const records = useSelector(selectAttendanceItems);
  const workers = useSelector(selectWorkerItems);
  const [target, setTarget] = useState(null);

  const workerById = (id) => workers.find((entry) => String(entry.id) === String(id));

  const rows = records
    .filter((record) => (date ? record.date === date : true))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  function confirmDelete() {
    dispatch(
      REMOVEATTENDANCE(
        target.id,
        () => {
          dispatch(showToast({ tone: "success", message: "Attendance record removed." }));
          setTarget(null);
        },
        (message) => dispatch(showToast({ tone: "error", message }))
      )
    );
  }

  return (
    <>
      <Card
        title={date ? `Attendance — ${formatDate(date)}` : "Attendance Records"}
        subtitle="Who was on the field, day by day"
      >
        {rows.length === 0 ? (
          <EmptyState
            title="No attendance records"
            text="Nothing has been marked for this day yet."
          />
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Worker</th>
                  <th>Status</th>
                  <th>Note</th>
                  {canDelete && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((record) => {
                  const worker = workerById(record.workerId);
                  return (
                    <tr key={record.id}>
                      <td className="nowrap">{formatDate(record.date)}</td>
                      <td>
                        <span className="cell-title">
                          {worker ? worker.name : "Unknown worker"}
                        </span>
                        <span className="cell-sub">{record.workerId}</span>
                      </td>
                      <td>
                        <StatusBadge tone={STATUS_TONES[record.status] || "grey"}>
                          {record.status}
                        </StatusBadge>
                      </td>
                      <td className="muted">{record.note || "—"}</td>
                      {canDelete && (
                        <td>
                          <div className="row-actions">
                            <button
                              type="button"
                              className="icon-btn icon-btn--danger"
                              aria-label="Delete attendance record"
                              onClick={() => setTarget(record)}
                            >
                              <IconTrash size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmModal
        open={Boolean(target)}
        title="Delete attendance record?"
        message={
          target
            ? `Attendance on ${formatDate(target.date)} will be permanently removed.`
            : ""
        }
        confirmLabel="Delete record"
        onConfirm={confirmDelete}
        onCancel={() => setTarget(null)}
      />
    </>
  );
}
