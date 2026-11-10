import { createCrudReducer } from "../factory.js";
import { ATTENDANCE_REQUEST } from "../../utilities.js";

/* One record per worker per day — duplicates are blocked in the api. */
export default createCrudReducer({
  name: "attendance",
  listKey: "records",
  group: ATTENDANCE_REQUEST,
  entity: "attendance",
  hooks: {
    onAdd: (list, record) => [...list, record],
  },
});
