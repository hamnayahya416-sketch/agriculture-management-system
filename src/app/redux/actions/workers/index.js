import { WORKER_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/workers/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function GETWORKERS(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(WORKER_REQUEST.GET_WORKER_REQUEST));
      const res = await api.getAll(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(WORKER_REQUEST.GET_WORKER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(WORKER_REQUEST.GET_WORKER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(WORKER_REQUEST.GET_WORKER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function ADDWORKER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(WORKER_REQUEST.ADD_WORKER_REQUEST));
      const res = await api.save(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(WORKER_REQUEST.ADD_WORKER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(WORKER_REQUEST.ADD_WORKER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(WORKER_REQUEST.ADD_WORKER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function UPDATEWORKER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(WORKER_REQUEST.UPDATE_WORKER_REQUEST));
      const res = await api.update(data && data.id, data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(WORKER_REQUEST.UPDATE_WORKER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(WORKER_REQUEST.UPDATE_WORKER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(WORKER_REQUEST.UPDATE_WORKER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function REMOVEWORKER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(WORKER_REQUEST.REMOVE_WORKER_REQUEST));
      const res = await api.remove(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(WORKER_REQUEST.REMOVE_WORKER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(WORKER_REQUEST.REMOVE_WORKER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(WORKER_REQUEST.REMOVE_WORKER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
