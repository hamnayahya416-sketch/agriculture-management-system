import {
  applyRequestFlags,
  applySuccessFlags,
  applyFailureFlags,
  initialCrudFlags,
} from "../utilities.js";

function opTypes(group, entity) {
  const nameOf = (op) => {
    if (typeof entity === "string") return entity;
    return entity[op] || entity.get;
  };
  const up = (op) => nameOf(op).toUpperCase();
  return {
    get: {
      request: group[`GET_${up("get")}_REQUEST`],
      success: group[`GET_${up("get")}_SUCCESS`],
      failure: group[`GET_${up("get")}_FAILURE`],
    },
    add: {
      request: group[`ADD_${up("add")}_REQUEST`],
      success: group[`ADD_${up("add")}_SUCCESS`],
      failure: group[`ADD_${up("add")}_FAILURE`],
    },
    update: {
      request: group[`UPDATE_${up("update")}_REQUEST`],
      success: group[`UPDATE_${up("update")}_SUCCESS`],
      failure: group[`UPDATE_${up("update")}_FAILURE`],
    },
    remove: {
      request: group[`REMOVE_${up("remove")}_REQUEST`],
      success: group[`REMOVE_${up("remove")}_SUCCESS`],
      failure: group[`REMOVE_${up("remove")}_FAILURE`],
    },
  };
}

/* Builds a reducer that keeps get/add/update/remove request flags plus the
   entity list. ADD / UPDATE / REMOVE success update the list directly so the
   UI refreshes without a second fetch. */
export function createCrudReducer({ name, listKey, group, entity, hooks = {} }) {
  const types = opTypes(group, entity);
  const initialState = {
    [listKey]: [],
    ...initialCrudFlags(name),
  };

  return function reducer(state = initialState, action) {
    switch (action.type) {
      case types.get.request:
        return applyRequestFlags(state, name, "get");
      case types.get.success:
        return {
          ...applySuccessFlags(state, name, "get"),
          [listKey]: hooks.onGet ? hooks.onGet(action.payload) : action.payload,
        };
      case types.get.failure:
        return applyFailureFlags(state, name, "get", action.payload);

      case types.add.request:
        return applyRequestFlags(state, name, "add");
      case types.add.success: {
        const list = state[listKey] || [];
        const next = hooks.onAdd ? hooks.onAdd(list, action.payload) : [...list, action.payload];
        return { ...applySuccessFlags(state, name, "add"), [listKey]: next };
      }
      case types.add.failure:
        return applyFailureFlags(state, name, "add", action.payload);

      case types.update.request:
        return applyRequestFlags(state, name, "update");
      case types.update.success: {
        const list = state[listKey] || [];
        const next = hooks.onUpdate
          ? hooks.onUpdate(list, action.payload)
          : list.map((item) =>
              String(item.id) === String(action.payload.id)
                ? { ...item, ...action.payload }
                : item
            );
        return { ...applySuccessFlags(state, name, "update"), [listKey]: next };
      }
      case types.update.failure:
        return applyFailureFlags(state, name, "update", action.payload);

      case types.remove.request:
        return applyRequestFlags(state, name, "remove");
      case types.remove.success: {
        const list = state[listKey] || [];
        const next = hooks.onRemove
          ? hooks.onRemove(list, action.payload)
          : list.filter((item) => String(item.id) !== String(action.payload));
        return { ...applySuccessFlags(state, name, "remove"), [listKey]: next };
      }
      case types.remove.failure:
        return applyFailureFlags(state, name, "remove", action.payload);

      default:
        return state;
    }
  };
}
