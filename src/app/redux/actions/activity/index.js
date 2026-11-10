import { ACTIVITY_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/activity/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function GETACTIVITY(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(ACTIVITY_REQUEST.GET_ACTIVITY_REQUEST));
      const res = await api.getAll(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(ACTIVITY_REQUEST.GET_ACTIVITY_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(ACTIVITY_REQUEST.GET_ACTIVITY_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not load the activity log.";
      dispatch(FAILURE(ACTIVITY_REQUEST.GET_ACTIVITY_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function LOGACTIVITY(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(ACTIVITY_REQUEST.LOG_ACTIVITY_REQUEST));
      const res = await api.log(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(ACTIVITY_REQUEST.LOG_ACTIVITY_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(ACTIVITY_REQUEST.LOG_ACTIVITY_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not save the log entry.";
      dispatch(FAILURE(ACTIVITY_REQUEST.LOG_ACTIVITY_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function CLEARACTIVITY(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(ACTIVITY_REQUEST.CLEAR_ACTIVITY_REQUEST));
      const res = await api.clear(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(ACTIVITY_REQUEST.CLEAR_ACTIVITY_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(ACTIVITY_REQUEST.CLEAR_ACTIVITY_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not clear the log.";
      dispatch(FAILURE(ACTIVITY_REQUEST.CLEAR_ACTIVITY_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
