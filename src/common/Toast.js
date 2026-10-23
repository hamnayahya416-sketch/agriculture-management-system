import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../store/actions/uiActions";
import { selectToast } from "../store/selectors/entitySelectors";

export default function Toast() {
  const toast = useSelector(selectToast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => dispatch(hideToast()), 4000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.tone}`} role="status" aria-live="polite" key={toast.id}>
      <span className="toast__dot" />
      {toast.message}
    </div>
  );
}
