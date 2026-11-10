import { TASK_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/tasks/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function GETTASKS(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(TASK_REQUEST.GET_TASK_REQUEST));
      const res = await api.getAll(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(TASK_REQUEST.GET_TASK_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(TASK_REQUEST.GET_TASK_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(TASK_REQUEST.GET_TASK_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function ADDTASK(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(TASK_REQUEST.ADD_TASK_REQUEST));
      const res = await api.save(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(TASK_REQUEST.ADD_TASK_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(TASK_REQUEST.ADD_TASK_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(TASK_REQUEST.ADD_TASK_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function UPDATETASK(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(TASK_REQUEST.UPDATE_TASK_REQUEST));
      const res = await api.update(data && data.id, data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(TASK_REQUEST.UPDATE_TASK_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(TASK_REQUEST.UPDATE_TASK_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(TASK_REQUEST.UPDATE_TASK_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function REMOVETASK(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(TASK_REQUEST.REMOVE_TASK_REQUEST));
      const res = await api.remove(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(TASK_REQUEST.REMOVE_TASK_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(TASK_REQUEST.REMOVE_TASK_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(TASK_REQUEST.REMOVE_TASK_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
