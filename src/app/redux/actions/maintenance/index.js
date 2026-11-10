import { MAINTENANCE_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/maintenance/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function GETMAINTENANCE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(MAINTENANCE_REQUEST.GET_SERVICE_REQUEST));
      const res = await api.getAll(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(MAINTENANCE_REQUEST.GET_SERVICE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(MAINTENANCE_REQUEST.GET_SERVICE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(MAINTENANCE_REQUEST.GET_SERVICE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function ADDSERVICE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(MAINTENANCE_REQUEST.ADD_SERVICE_REQUEST));
      const res = await api.save(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(MAINTENANCE_REQUEST.ADD_SERVICE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(MAINTENANCE_REQUEST.ADD_SERVICE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(MAINTENANCE_REQUEST.ADD_SERVICE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function UPDATESERVICE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(MAINTENANCE_REQUEST.UPDATE_SERVICE_REQUEST));
      const res = await api.update(data && data.id, data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(MAINTENANCE_REQUEST.UPDATE_SERVICE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(MAINTENANCE_REQUEST.UPDATE_SERVICE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(MAINTENANCE_REQUEST.UPDATE_SERVICE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function REMOVESERVICE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(MAINTENANCE_REQUEST.REMOVE_SERVICE_REQUEST));
      const res = await api.remove(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(MAINTENANCE_REQUEST.REMOVE_SERVICE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(MAINTENANCE_REQUEST.REMOVE_SERVICE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(MAINTENANCE_REQUEST.REMOVE_SERVICE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
