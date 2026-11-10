import { ACTIVITY_REQUEST } from "../../utilities.js";
import { SEED_ACTIVITY } from "../../../../fake-db/seedData.js";

const initialState = { logs: SEED_ACTIVITY };

export default function activityReducer(state = initialState, action) {
  switch (action.type) {
    case ACTIVITY_REQUEST.GET_ACTIVITY_SUCCESS:
      return { logs: Array.isArray(action.payload) ? action.payload : state.logs };
    case ACTIVITY_REQUEST.LOG_ACTIVITY_SUCCESS:
      /* The api returns the full, trimmed list. */
      return { logs: Array.isArray(action.payload) ? action.payload : state.logs };
    case ACTIVITY_REQUEST.CLEAR_ACTIVITY_SUCCESS:
      return { logs: [] };
    default:
      return state;
  }
}
