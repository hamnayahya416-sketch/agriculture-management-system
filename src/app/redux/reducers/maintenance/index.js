import { createCrudReducer } from "../factory.js";
import { MAINTENANCE_REQUEST } from "../../utilities.js";

export default createCrudReducer({
  name: "maintenance",
  listKey: "services",
  group: MAINTENANCE_REQUEST,
  entity: "service",
  hooks: {
    onAdd: (list, service) => [service, ...list],
  },
});
