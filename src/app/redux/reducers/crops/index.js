import { CROP_REQUEST } from "../../utilities.js";
import { createCrudReducer } from "../factory.js";

/* crops slice: crops[] + get/add/update/remove request flags. */
const cropsReducer = createCrudReducer({
  name: "crops",
  listKey: "crops",
  group: CROP_REQUEST,
  entity: "CROP",
});

export default cropsReducer;
