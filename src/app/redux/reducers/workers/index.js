import { createCrudReducer } from "../factory.js";
import { WORKER_REQUEST } from "../../utilities.js";

export default createCrudReducer({
  name: "workers",
  listKey: "workers",
  group: WORKER_REQUEST,
  entity: "worker",
});
