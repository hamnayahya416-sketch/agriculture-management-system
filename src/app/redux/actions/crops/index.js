import { CROP_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as cropsApi from "../../api/crops/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function GETCROPS(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(CROP_REQUEST.GET_CROP_REQUEST));
      const res = await cropsApi.getAll(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(CROP_REQUEST.GET_CROP_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(CROP_REQUEST.GET_CROP_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not load crops.";
      dispatch(FAILURE(CROP_REQUEST.GET_CROP_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function ADDCROP(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(CROP_REQUEST.ADD_CROP_REQUEST));
      const res = await cropsApi.save(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(CROP_REQUEST.ADD_CROP_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(CROP_REQUEST.ADD_CROP_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not add the crop.";
      dispatch(FAILURE(CROP_REQUEST.ADD_CROP_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function UPDATECROP(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(CROP_REQUEST.UPDATE_CROP_REQUEST));
      const { id, ...changes } = data || {};
      const res = await cropsApi.update(id, changes);
      if (res.data.succeeded) {
        dispatch(SUCCESS(CROP_REQUEST.UPDATE_CROP_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(CROP_REQUEST.UPDATE_CROP_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not update the crop.";
      dispatch(FAILURE(CROP_REQUEST.UPDATE_CROP_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function REMOVECROP(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(CROP_REQUEST.REMOVE_CROP_REQUEST));
      const res = await cropsApi.remove(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(CROP_REQUEST.REMOVE_CROP_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(CROP_REQUEST.REMOVE_CROP_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not remove the crop.";
      dispatch(FAILURE(CROP_REQUEST.REMOVE_CROP_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
