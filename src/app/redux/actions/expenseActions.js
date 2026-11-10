import { expensesSlice } from "../reducers/expensesReducer.js";

/* Action types: expenses/add, expenses/update, expenses/remove */
export const {
  add: addExpense,
  update: updateExpense,
  remove: removeExpense,
  setAll: setAllExpenses,
} = expensesSlice.actions;
