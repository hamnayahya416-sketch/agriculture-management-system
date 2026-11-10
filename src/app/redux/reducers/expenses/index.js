import { createCrudReducer } from "../factory.js";
import { EXPENSE_REQUEST } from "../../utilities.js";

/* Expenses list: newest entries appear first (unshift). */
export default createCrudReducer({
  name: "expenses",
  listKey: "expenses",
  group: EXPENSE_REQUEST,
  entity: "expense",
  hooks: {
    onAdd: (list, expense) => [expense, ...list],
  },
});
