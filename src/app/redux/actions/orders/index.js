import { ORDER_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/orders/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function GETORDERS(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(ORDER_REQUEST.GET_ORDER_REQUEST));
      const res = await api.getAll(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(ORDER_REQUEST.GET_ORDER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(ORDER_REQUEST.GET_ORDER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(ORDER_REQUEST.GET_ORDER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function ADDORDER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(ORDER_REQUEST.ADD_ORDER_REQUEST));
      const res = await api.save(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(ORDER_REQUEST.ADD_ORDER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(ORDER_REQUEST.ADD_ORDER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(ORDER_REQUEST.ADD_ORDER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function UPDATEORDER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(ORDER_REQUEST.UPDATE_ORDER_REQUEST));
      const res = await api.update(data && data.id, data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(ORDER_REQUEST.UPDATE_ORDER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(ORDER_REQUEST.UPDATE_ORDER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(ORDER_REQUEST.UPDATE_ORDER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function REMOVEORDER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(ORDER_REQUEST.REMOVE_ORDER_REQUEST));
      const res = await api.remove(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(ORDER_REQUEST.REMOVE_ORDER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(ORDER_REQUEST.REMOVE_ORDER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(ORDER_REQUEST.REMOVE_ORDER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
