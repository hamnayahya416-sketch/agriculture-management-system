import { EXPENSE_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/expenses/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function GETEXPENSES(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(EXPENSE_REQUEST.GET_EXPENSE_REQUEST));
      const res = await api.getAll(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(EXPENSE_REQUEST.GET_EXPENSE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(EXPENSE_REQUEST.GET_EXPENSE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(EXPENSE_REQUEST.GET_EXPENSE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function ADDEXPENSE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(EXPENSE_REQUEST.ADD_EXPENSE_REQUEST));
      const res = await api.save(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(EXPENSE_REQUEST.ADD_EXPENSE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(EXPENSE_REQUEST.ADD_EXPENSE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(EXPENSE_REQUEST.ADD_EXPENSE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function UPDATEEXPENSE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(EXPENSE_REQUEST.UPDATE_EXPENSE_REQUEST));
      const res = await api.update(data && data.id, data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(EXPENSE_REQUEST.UPDATE_EXPENSE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(EXPENSE_REQUEST.UPDATE_EXPENSE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(EXPENSE_REQUEST.UPDATE_EXPENSE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function REMOVEEXPENSE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(EXPENSE_REQUEST.REMOVE_EXPENSE_REQUEST));
      const res = await api.remove(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(EXPENSE_REQUEST.REMOVE_EXPENSE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(EXPENSE_REQUEST.REMOVE_EXPENSE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Request failed.";
      dispatch(FAILURE(EXPENSE_REQUEST.REMOVE_EXPENSE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
