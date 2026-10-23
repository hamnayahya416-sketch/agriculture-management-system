import { useDispatch, useSelector } from "react-redux";
import { selectAlerts } from "../store/selectors/selectAlerts";
import { dismissAlert } from "../store/actions/alertActions";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import StatusBadge from "../common/StatusBadge";
import { IconClose } from "../common/icons";

export default function AlertsPanel() {
  const dispatch = useDispatch();
  const alerts = useSelector(selectAlerts);

  return (
    <Card
      title="Alerts"
      subtitle={
        alerts.length
          ? `${alerts.length} item${alerts.length === 1 ? "" : "s"} need attention`
          : "Everything looks good"
      }
      action={
        alerts.length ? (
          <StatusBadge tone={alerts.some((a) => a.severity === "danger") ? "red" : "amber"}>
            {alerts.length} active
          </StatusBadge>
        ) : null
      }
    >
      {alerts.length === 0 ? (
        <EmptyState title="No active alerts" text="Low stock, critical crops, due cuttings and overdue tasks show up here." />
      ) : (
        <ul className="alert-list">
          {alerts.map((alert) => (
            <li key={alert.id} className={`alert-list__item alert-list__item--${alert.severity}`}>
              <span className="alert-list__body">
                <b>{alert.title}</b>
                <small>{alert.message}</small>
              </span>
              <button
                type="button"
                className="icon-btn"
                onClick={() => dispatch(dismissAlert(alert.id))}
                aria-label={`Dismiss ${alert.title}`}
              >
                <IconClose size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
