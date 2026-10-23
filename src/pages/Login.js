import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import LoginForm from "../auth/LoginForm";
import { selectCurrentUser } from "../store/selectors/entitySelectors";
import { IconLeaf } from "../common/icons";

export default function Login() {
  const user = useSelector(selectCurrentUser);
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__brand">
          <span className="brand__mark">
            <IconLeaf size={22} />
          </span>
          <div>
            <b>AgriCore</b>
            <small>Smart Agriculture Management System</small>
          </div>
        </div>

        <h1>Welcome back</h1>
        <p className="muted">
          Sign in to manage crops, harvests, buyers, tasks and reports.
        </p>

        <LoginForm />

        <p className="login-card__note">
          U Devs (SMC-Private) Limited · Internship Batch 6 · Hamna Yahya
        </p>
      </div>
    </div>
  );
}
