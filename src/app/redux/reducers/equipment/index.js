import { createCrudReducer } from "../factory.js";
import { EQUIPMENT_REQUEST } from "../../utilities.js";

export default createCrudReducer({
  name: "equipment",
  listKey: "equipment",
  group: EQUIPMENT_REQUEST,
  entity: "equipment",
});
