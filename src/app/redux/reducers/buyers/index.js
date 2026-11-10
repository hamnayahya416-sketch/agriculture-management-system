import { createCrudReducer } from "../factory.js";
import { BUYER_REQUEST } from "../../utilities.js";

/* Buyers list: newest entries appear first (unshift). */
export default createCrudReducer({
  name: "buyers",
  listKey: "buyers",
  group: BUYER_REQUEST,
  entity: "buyer",
  hooks: {
    onAdd: (list, buyer) => [buyer, ...list],
  },
});
