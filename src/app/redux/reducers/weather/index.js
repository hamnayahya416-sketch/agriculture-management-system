import { WEATHER_REQUEST } from "../../utilities.js";

const initialState = {
  status: "idle", // idle | loading | succeeded | failed
  data: null,
  error: null,
  lastUpdated: null,
};

export default function weatherReducer(state = initialState, action) {
  switch (action.type) {
    case WEATHER_REQUEST.FETCH_REQUEST:
      return { ...state, status: "loading", error: null };
    case WEATHER_REQUEST.FETCH_SUCCESS:
      return {
        ...state,
        status: "succeeded",
        data: action.payload,
        error: null,
        lastUpdated: new Date().toISOString(),
      };
    case WEATHER_REQUEST.FETCH_FAILURE:
      return { ...state, status: "failed", error: action.payload || "Unable to load weather." };
    default:
      return state;
  }
}
