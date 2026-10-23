import { tasksSlice } from "../reducers/tasksReducer";

/* Action types: tasks/add, tasks/update, tasks/remove, tasks/setStatus */
export const {
  add: addTask,
  update: updateTask,
  remove: removeTask,
  setStatus: setTaskStatus,
  setAll: setAllTasks,
} = tasksSlice.actions;
