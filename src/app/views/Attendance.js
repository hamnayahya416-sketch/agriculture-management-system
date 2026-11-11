import { useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../components/common/PageHeader.js";
import StatCard from "../components/common/StatCard.js";
import AttendancePanel from "../components/attendance/AttendancePanel.js";
import AttendanceTable from "../components/attendance/AttendanceTable.js";
import { selectWorkerItems } from "../redux/selectors/entitySelectors.js";
import { selectAttendanceForDate } from "../redux/selectors/workforceSelectors.js";
import { todayIso } from "../utils/formatters.js";
import {
  IconCheckCircle,
  IconAlert,
  IconClock,
  IconUsers,
} from "../components/common/icons.js";

export default function Attendance() {
  const [date, setDate] = useState(todayIso());
  const workers = useSelector(selectWorkerItems);
  const records = useSelector((state) => selectAttendanceForDate(state, date));

  const present = records.filter((record) => record.status === "Present").length;
  const absent = records.filter((record) => record.status === "Absent").length;
  const leave = records.filter((record) => record.status === "Leave").length;
  const onRoll = workers.filter((worker) => worker.status === "Active").length;

  return (
    <>
      <PageHeader
        title="Attendance"
        description="Mark who showed up, who was off and who is on leave."
        action={
          <label className="field field--inline">
            <span>Date</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value || todayIso())}
              aria-label="Attendance date"
            />
          </label>
        }
      />

      <div className="stats-row">
        <StatCard
          icon={<IconCheckCircle size={20} />}
          label="Present"
          value={present}
          note="Marked present"
        />
        <StatCard
          icon={<IconAlert size={20} />}
          tone="amber"
          label="Absent"
          value={absent}
          note="Marked absent"
        />
        <StatCard
          icon={<IconClock size={20} />}
          tone="violet"
          label="Leave"
          value={leave}
          note="On leave"
        />
        <StatCard
          icon={<IconUsers size={20} />}
          tone="blue"
          label="Workers on roll"
          value={onRoll}
          note="Active workers"
        />
      </div>

      <div className="grid">
        <div className="span-7">
          <AttendancePanel date={date} />
        </div>

        <div className="span-5">
          <AttendanceTable date={date} />
        </div>
      </div>
    </>
  );
}
