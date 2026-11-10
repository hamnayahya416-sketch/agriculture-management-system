import { INVENTORY_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/inventory/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function GETINVENTORY(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(INVENTORY_REQUEST.GET_INVENTORY_REQUEST));
      const res = await api.getAll(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(INVENTORY_REQUEST.GET_INVENTORY_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(INVENTORY_REQUEST.GET_INVENTORY_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not load inventory.";
      dispatch(FAILURE(INVENTORY_REQUEST.GET_INVENTORY_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function ADDITEM(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(INVENTORY_REQUEST.ADD_ITEM_REQUEST));
      const res = await api.save(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(INVENTORY_REQUEST.ADD_ITEM_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(INVENTORY_REQUEST.ADD_ITEM_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not add the item.";
      dispatch(FAILURE(INVENTORY_REQUEST.ADD_ITEM_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function UPDATEITEM(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(INVENTORY_REQUEST.UPDATE_ITEM_REQUEST));
      const { id, ...changes } = data || {};
      const res = await api.update(id, changes);
      if (res.data.succeeded) {
        dispatch(SUCCESS(INVENTORY_REQUEST.UPDATE_ITEM_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(INVENTORY_REQUEST.UPDATE_ITEM_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not update the item.";
      dispatch(FAILURE(INVENTORY_REQUEST.UPDATE_ITEM_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function REMOVEITEM(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(INVENTORY_REQUEST.REMOVE_ITEM_REQUEST));
      const res = await api.remove(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(INVENTORY_REQUEST.REMOVE_ITEM_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(INVENTORY_REQUEST.REMOVE_ITEM_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not remove the item.";
      dispatch(FAILURE(INVENTORY_REQUEST.REMOVE_ITEM_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function ADDUSAGE(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(INVENTORY_REQUEST.ADD_USAGE_REQUEST));
      const res = await api.addUsage(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(INVENTORY_REQUEST.ADD_USAGE_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(INVENTORY_REQUEST.ADD_USAGE_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not record usage.";
      dispatch(FAILURE(INVENTORY_REQUEST.ADD_USAGE_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
