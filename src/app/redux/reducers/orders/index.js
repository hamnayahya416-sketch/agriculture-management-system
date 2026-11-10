import { createCrudReducer } from "../factory.js";
import { ORDER_REQUEST } from "../../utilities.js";

/* Orders list: newest entries appear first (unshift). */
export default createCrudReducer({
  name: "orders",
  listKey: "orders",
  group: ORDER_REQUEST,
  entity: "order",
  hooks: {
    onAdd: (list, order) => [order, ...list],
  },
});
