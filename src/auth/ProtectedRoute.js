import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentRole,
} from "../store/selectors/entitySelectors";

/* Unauthenticated visitors are redirected to the login page.
   Optional `role` prop restricts a route to a single role. */
export default function ProtectedRoute({ children, role }) {
  const user = useSelector(selectCurrentUser);
  const currentRole = useSelector(selectCurrentRole);

  if (!user) return <Navigate to="/login" replace />;
  if (role && currentRole !== role) return <Navigate to="/dashboard" replace />;

  return children || <Outlet />;
}
