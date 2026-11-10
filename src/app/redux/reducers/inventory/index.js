import {
  INVENTORY_REQUEST,
  initialCrudFlags,
  applyRequestFlags,
  applySuccessFlags,
  applyFailureFlags,
} from "../../utilities.js";
import { SEED_INVENTORY } from "../../../../fake-db/seedData.js";

/* Items + usage history move together: every api call returns the pair. */
const initialState = {
  items: SEED_INVENTORY.items,
  usageHistory: SEED_INVENTORY.usage,
  usageLoading: false,
  usageSuccess: false,
  usageFailure: false,
  usageError: null,
  ...initialCrudFlags("inventory"),
};

function withState(state, payload) {
  const next = payload && typeof payload === "object" ? payload : null;
  if (!next) return state;
  return {
    ...state,
    items: Array.isArray(next.items) ? next.items : state.items,
    usageHistory: Array.isArray(next.usageHistory) ? next.usageHistory : state.usageHistory,
  };
}

export default function inventoryReducer(state = initialState, action) {
  switch (action.type) {
    case INVENTORY_REQUEST.GET_INVENTORY_REQUEST:
      return applyRequestFlags(state, "inventory", "get");
    case INVENTORY_REQUEST.GET_INVENTORY_SUCCESS:
      return withState(applySuccessFlags(state, "inventory", "get"), action.payload);
    case INVENTORY_REQUEST.GET_INVENTORY_FAILURE:
      return applyFailureFlags(state, "inventory", "get", action.payload);

    case INVENTORY_REQUEST.ADD_ITEM_REQUEST:
      return applyRequestFlags(state, "inventory", "add");
    case INVENTORY_REQUEST.ADD_ITEM_SUCCESS:
      return withState(applySuccessFlags(state, "inventory", "add"), action.payload);
    case INVENTORY_REQUEST.ADD_ITEM_FAILURE:
      return applyFailureFlags(state, "inventory", "add", action.payload);

    case INVENTORY_REQUEST.UPDATE_ITEM_REQUEST:
      return applyRequestFlags(state, "inventory", "update");
    case INVENTORY_REQUEST.UPDATE_ITEM_SUCCESS:
      return withState(applySuccessFlags(state, "inventory", "update"), action.payload);
    case INVENTORY_REQUEST.UPDATE_ITEM_FAILURE:
      return applyFailureFlags(state, "inventory", "update", action.payload);

    case INVENTORY_REQUEST.REMOVE_ITEM_REQUEST:
      return applyRequestFlags(state, "inventory", "remove");
    case INVENTORY_REQUEST.REMOVE_ITEM_SUCCESS:
      return withState(applySuccessFlags(state, "inventory", "remove"), action.payload);
    case INVENTORY_REQUEST.REMOVE_ITEM_FAILURE:
      return applyFailureFlags(state, "inventory", "remove", action.payload);

    case INVENTORY_REQUEST.ADD_USAGE_REQUEST:
      return { ...state, usageLoading: true, usageSuccess: false, usageFailure: false, usageError: null };
    case INVENTORY_REQUEST.ADD_USAGE_SUCCESS:
      return {
        ...withState(state, action.payload),
        usageLoading: false,
        usageSuccess: true,
        usageFailure: false,
        usageError: null,
      };
    case INVENTORY_REQUEST.ADD_USAGE_FAILURE:
      return {
        ...state,
        usageLoading: false,
        usageSuccess: false,
        usageFailure: true,
        usageError: action.payload || "Usage could not be recorded.",
      };

    default:
      return state;
  }
}
