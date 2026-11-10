import { buyersSlice } from "../reducers/buyersReducer.js";

/* Action types: buyers/add, buyers/update, buyers/remove */
export const { add: addBuyer, update: updateBuyer, remove: removeBuyer, setAll: setAllBuyers } =
  buyersSlice.actions;
