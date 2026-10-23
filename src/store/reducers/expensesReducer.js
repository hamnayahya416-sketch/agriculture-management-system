import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../thunks/loadFromStorage";
import { SEED_EXPENSES } from "../../data/seedData";
import { nextPrefixedId } from "../../utils/id";

export const initialState = {
  items: SEED_EXPENSES,
  status: "idle",
  error: null,
};

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    add(state, action) {
      const expense = { ...action.payload };
      if (!expense.id) expense.id = nextPrefixedId(state.items, "EXP");
      state.items.unshift(expense);
    },
    update(state, action) {
      const { id, ...changes } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...changes };
    },
    remove(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setAll(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFromStorage.fulfilled, (state, action) => {
      if (Array.isArray(action.payload.expenses)) state.items = action.payload.expenses;
    });
  },
});

export default expensesSlice.reducer;
