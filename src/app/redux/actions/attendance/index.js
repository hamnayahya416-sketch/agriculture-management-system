import { ATTENDANCE_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/attendance/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function GETATTENDANCE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(ATTENDANCE_REQUEST.GET_ATTENDANCE_REQUEST));
      const res = await api.getAll(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(ATTENDANCE_REQUEST.GET_ATTENDANCE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(ATTENDANCE_REQUEST.GET_ATTENDANCE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(ATTENDANCE_REQUEST.GET_ATTENDANCE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function MARKATTENDANCE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(ATTENDANCE_REQUEST.ADD_ATTENDANCE_REQUEST));
      const res = await api.save(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(ATTENDANCE_REQUEST.ADD_ATTENDANCE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(ATTENDANCE_REQUEST.ADD_ATTENDANCE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(ATTENDANCE_REQUEST.ADD_ATTENDANCE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function UPDATEATTENDANCE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(ATTENDANCE_REQUEST.UPDATE_ATTENDANCE_REQUEST));
      const res = await api.update(data && data.id, data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(ATTENDANCE_REQUEST.UPDATE_ATTENDANCE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(ATTENDANCE_REQUEST.UPDATE_ATTENDANCE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(ATTENDANCE_REQUEST.UPDATE_ATTENDANCE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function REMOVEATTENDANCE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(ATTENDANCE_REQUEST.REMOVE_ATTENDANCE_REQUEST));
      const res = await api.remove(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(ATTENDANCE_REQUEST.REMOVE_ATTENDANCE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(ATTENDANCE_REQUEST.REMOVE_ATTENDANCE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(ATTENDANCE_REQUEST.REMOVE_ATTENDANCE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
