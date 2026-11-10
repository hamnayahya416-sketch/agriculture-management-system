import { BUYER_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/buyers/index.js";
import { selectAvailableStockById } from "../../selectors/cropSelectors.js";
import {
  digitsOf,
  validateCnic,
  validateName,
  validateQuantity,
} from "../../../utils/validators.js";
import { todayIso } from "../../../utils/formatters.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function GETBUYERS(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(BUYER_REQUEST.GET_BUYER_REQUEST));
      const res = await api.getAll(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(BUYER_REQUEST.GET_BUYER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(BUYER_REQUEST.GET_BUYER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not load buyers.";
      dispatch(FAILURE(BUYER_REQUEST.GET_BUYER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

/* Validates name / CNIC / photo / stock before the api call — the api then
   enforces the duplicate CNIC rule once more on the stored list. */
export function SAVEBUYER(data, moveToNext, failure) {
  return async (dispatch, getState) => {
    const isEdit = Boolean(data && data.id);
    try {
      dispatch(
        REQUEST(isEdit ? BUYER_REQUEST.UPDATE_BUYER_REQUEST : BUYER_REQUEST.ADD_BUYER_REQUEST)
      );
      const state = getState();

      const nameError = validateName(data.name);
      if (nameError) throw new Error(nameError);
      const cnicError = validateCnic(data.cnic);
      if (cnicError) throw new Error(cnicError);
      if (!data.imageBase64) throw new Error("A photo is required.");

      const crop = state.crops.crops.find(
        (entry) => String(entry.id) === String(data.cropId)
      );
      if (!crop) throw new Error("Please choose a valid crop.");

      const available = selectAvailableStockById(state, crop.id);
      const existing = data.id
        ? state.buyers.buyers.find((entry) => String(entry.id) === String(data.id))
        : null;
      const refund =
        existing && String(existing.cropId) === String(crop.id)
          ? Number(existing.quantity) || 0
          : 0;
      const quantityError = validateQuantity(data.quantity, available + refund);
      if (quantityError) throw new Error(quantityError);

      const buyer = {
        id: data.id,
        name: String(data.name).trim(),
        cnic: digitsOf(data.cnic),
        imageBase64: data.imageBase64,
        cropId: crop.id,
        quantity: Number(data.quantity),
        date: data.date || todayIso(),
      };

      if (!isEdit) delete buyer.id;
      const res = isEdit ? await api.update(buyer.id, buyer) : await api.save(buyer);

      if (res.data.succeeded) {
        dispatch(
          SUCCESS(
            isEdit ? BUYER_REQUEST.UPDATE_BUYER_SUCCESS : BUYER_REQUEST.ADD_BUYER_SUCCESS,
            res.data.data
          )
        );
        if (moveToNext) moveToNext(res.data.data);
      } else {
        const type = isEdit ? BUYER_REQUEST.UPDATE_BUYER_FAILURE : BUYER_REQUEST.ADD_BUYER_FAILURE;
        dispatch(FAILURE(type, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not save the buyer.";
      const type = isEdit ? BUYER_REQUEST.UPDATE_BUYER_FAILURE : BUYER_REQUEST.ADD_BUYER_FAILURE;
      dispatch(FAILURE(type, message));
      if (failure) failure(message);
    }
  };
}

export function UPDATEBUYER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(BUYER_REQUEST.UPDATE_BUYER_REQUEST));
      const { id, ...changes } = data || {};
      const res = await api.update(id, changes);
      if (res.data.succeeded) {
        dispatch(SUCCESS(BUYER_REQUEST.UPDATE_BUYER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(BUYER_REQUEST.UPDATE_BUYER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not update the buyer.";
      dispatch(FAILURE(BUYER_REQUEST.UPDATE_BUYER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function REMOVEBUYER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(BUYER_REQUEST.REMOVE_BUYER_REQUEST));
      const res = await api.remove(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(BUYER_REQUEST.REMOVE_BUYER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(BUYER_REQUEST.REMOVE_BUYER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not remove the buyer.";
      dispatch(FAILURE(BUYER_REQUEST.REMOVE_BUYER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
