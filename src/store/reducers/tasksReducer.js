import { createSlice } from "@reduxjs/toolkit";
import { loadFromStorage } from "../thunks/loadFromStorage";
import { SEED_TASKS } from "../../data/seedData";
import { nextPrefixedId } from "../../utils/id";

export const initialState = {
  items: SEED_TASKS,
  status: "idle",
  error: null,
};

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    add(state, action) {
      const task = { ...action.payload };
      if (!task.id) task.id = nextPrefixedId(state.items, "TSK");
      state.items.push(task);
    },
    update(state, action) {
      const { id, ...changes } = action.payload;
      const index = state.items.findIndex((item) => item.id === id);
      if (index !== -1) state.items[index] = { ...state.items[index], ...changes };
    },
    remove(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setStatus(state, action) {
      const { id, status } = action.payload;
      const task = state.items.find((item) => item.id === id);
      if (task) task.status = status;
    },
    setAll(state, action) {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFromStorage.fulfilled, (state, action) => {
      if (Array.isArray(action.payload.tasks)) state.items = action.payload.tasks;
    });
  },
});

export default tasksSlice.reducer;
