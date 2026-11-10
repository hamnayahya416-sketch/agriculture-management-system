import { ALERT } from "../../utilities.js";
import { KEYS, readValue } from "../../api/index.js";

const saved = readValue(KEYS.alerts, null);

const initialState = {
  dismissed: saved && Array.isArray(saved.dismissed) ? saved.dismissed : [],
};

export default function alertsReducer(state = initialState, action) {
  switch (action.type) {
    case ALERT.DISMISS:
      return state.dismissed.includes(action.payload)
        ? state
        : { ...state, dismissed: [...state.dismissed, action.payload] };
    case ALERT.DISMISS_ALL:
      return { ...state, dismissed: Array.isArray(action.payload) ? action.payload : [] };
    case ALERT.RESET:
      return { ...state, dismissed: [] };
    default:
      return state;
  }
}
