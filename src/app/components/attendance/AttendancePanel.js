import { useDispatch, useSelector } from "react-redux";
import Card from "../common/Card.js";
import EmptyState from "../common/EmptyState.js";
import { selectWorkerItems } from "../../redux/selectors/entitySelectors.js";
import { selectAttendanceForDate } from "../../redux/selectors/workforceSelectors.js";
import { MARKATTENDANCE, UPDATEATTENDANCE } from "../../redux/actions/attendance/index.js";
import { showToast } from "../../redux/actions/ui/index.js";
import { formatDate, todayIso } from "../../utils/formatters.js";
import useRole from "../../hooks/useRole.js";

const STATUSES = ["Present", "Absent", "Leave"];

export default function AttendancePanel({ date }) {
  const dispatch = useDispatch();
  const { canAdd } = useRole();
  const workers = useSelector(selectWorkerItems);
  const day = date || todayIso();
  const records = useSelector((state) => selectAttendanceForDate(state, day));

  const activeWorkers = workers.filter((worker) => worker.status !== "Inactive");
  const byWorker = {};
  records.forEach((record) => {
    byWorker[String(record.workerId)] = record;
  });

  function mark(worker, status) {
    const success = () =>
      dispatch(showToast({ tone: "success", message: `Marked ${worker.name} as ${status}.` }));
    const failure = (message) => dispatch(showToast({ tone: "error", message }));
    const existing = byWorker[String(worker.id)];

    if (existing) {
      dispatch(
        UPDATEATTENDANCE(
          { id: existing.id, status, date: day, workerId: worker.id },
          success,
          failure
        )
      );
    } else {
      dispatch(MARKATTENDANCE({ workerId: worker.id, date: day, status, note: "" }, success, failure));
    }
  }

  return (
    <Card
      title="Mark Attendance"
      subtitle={`Tap a status for each worker — ${formatDate(day)}`}
    >
      {activeWorkers.length === 0 ? (
        <EmptyState
          title="No active workers"
          text="Add workers first, then come back to mark their attendance."
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Worker</th>
                <th>Mark attendance</th>
              </tr>
            </thead>
            <tbody>
              {activeWorkers.map((worker) => {
                const record = byWorker[String(worker.id)];
                return (
                  <tr key={worker.id}>
                    <td>
                      <span className="cell-title">{worker.name}</span>
                      <span className="cell-sub">{worker.job}</span>
                    </td>
                    <td>
                      <div className="chip-row">
                        {STATUSES.map((status) => (
                          <button
                            key={status}
                            type="button"
                            className={`chip ${record && record.status === status ? "is-active" : ""}`.trim()}
                            aria-pressed={Boolean(record && record.status === status)}
                            disabled={!canAdd}
                            onClick={() => mark(worker, status)}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
