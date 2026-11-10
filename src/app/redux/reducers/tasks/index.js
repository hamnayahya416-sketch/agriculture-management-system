import { createCrudReducer } from "../factory.js";
import { TASK_REQUEST } from "../../utilities.js";

export default createCrudReducer({
  name: "tasks",
  listKey: "tasks",
  group: TASK_REQUEST,
  entity: "task",
});
