import { EQUIPMENT_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/equipment/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function GETEQUIPMENT(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(EQUIPMENT_REQUEST.GET_EQUIPMENT_REQUEST));
      const res = await api.getAll(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(EQUIPMENT_REQUEST.GET_EQUIPMENT_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(EQUIPMENT_REQUEST.GET_EQUIPMENT_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(EQUIPMENT_REQUEST.GET_EQUIPMENT_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function ADDEQUIPMENT(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(EQUIPMENT_REQUEST.ADD_EQUIPMENT_REQUEST));
      const res = await api.save(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(EQUIPMENT_REQUEST.ADD_EQUIPMENT_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(EQUIPMENT_REQUEST.ADD_EQUIPMENT_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(EQUIPMENT_REQUEST.ADD_EQUIPMENT_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function UPDATEEQUIPMENT(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(EQUIPMENT_REQUEST.UPDATE_EQUIPMENT_REQUEST));
      const res = await api.update(data && data.id, data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(EQUIPMENT_REQUEST.UPDATE_EQUIPMENT_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(EQUIPMENT_REQUEST.UPDATE_EQUIPMENT_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(EQUIPMENT_REQUEST.UPDATE_EQUIPMENT_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function REMOVEEQUIPMENT(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(EQUIPMENT_REQUEST.REMOVE_EQUIPMENT_REQUEST));
      const res = await api.remove(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(EQUIPMENT_REQUEST.REMOVE_EQUIPMENT_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(EQUIPMENT_REQUEST.REMOVE_EQUIPMENT_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(EQUIPMENT_REQUEST.REMOVE_EQUIPMENT_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
