import { useSelector } from "react-redux";
import { selectCurrentRole } from "../redux/selectors/entitySelectors.js";

/* Role helper: role, canEdit (Admin only), canDelete (Admin only), canAdd. */
export default function useRole() {
  const role = useSelector(selectCurrentRole);
  const isAdmin = role === "Admin";
  return {
    role,
    isAdmin,
    canEdit: isAdmin,
    canDelete: isAdmin,
    canAdd: Boolean(role),
  };
}
