import { Link } from "react-router-dom";
import EmptyState from "../common/EmptyState";

export default function NotFound() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Page not found</h1>
          <p>The page you are looking for does not exist.</p>
        </div>
      </div>

      <EmptyState
        title="404 — nothing here"
        text="Check the sidebar links or go back to the dashboard."
        action={
          <Link className="btn" to="/dashboard">
            Back to Dashboard
          </Link>
        }
      />
    </>
  );
}
