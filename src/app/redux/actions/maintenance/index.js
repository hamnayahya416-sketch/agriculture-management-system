import { MAINTENANCE_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/maintenance/index.js";
import { ADDEXPENSE } from "../expenses/index.js";
import { UPDATEEQUIPMENT } from "../equipment/index.js";

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
  return async (dispatch, getState) => {
    try {
      dispatch(REQUEST(MAINTENANCE_REQUEST.ADD_SERVICE_REQUEST));
      const res = await api.save(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(MAINTENANCE_REQUEST.ADD_SERVICE_SUCCESS, res.data.data));

        /* Side-effects: log the cost as an expense and refresh the service date. */
        const cost = Number(data && data.cost);
        if (cost > 0) {
          const equipment = (getState().equipment.equipment || []).find(
            (entry) => String(entry.id) === String(data.equipmentId)
          );
          dispatch(
            ADDEXPENSE({
              cropId: null,
              category: "Equipment",
              amount: cost,
              date: data.date,
              note: equipment
                ? `${data.type} — ${equipment.name}`
                : data.notes || "Equipment maintenance",
            })
          );
        }
        if (data && data.equipmentId && data.date) {
          dispatch(UPDATEEQUIPMENT({ id: data.equipmentId, lastServiceDate: data.date }));
        }

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
