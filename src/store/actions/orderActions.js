import { ordersSlice } from "../reducers/ordersReducer";

/* Action types: orders/add, orders/update, orders/remove, orders/setStatus */
export const {
  add: addOrder,
  update: updateOrder,
  remove: removeOrder,
  setStatus: setOrderStatus,
  setAll: setAllOrders,
} = ordersSlice.actions;
