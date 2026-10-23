import { IconInbox } from "./icons";

export default function EmptyState({ title, text, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">
        <IconInbox size={26} />
      </span>
      <h4>{title}</h4>
      <p>{text}</p>
      {action}
    </div>
  );
}
