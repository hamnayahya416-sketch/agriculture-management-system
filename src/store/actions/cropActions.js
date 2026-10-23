import { cropsSlice } from "../reducers/cropsReducer";

/* Action types: crops/add, crops/update, crops/remove, crops/setAll */
export const { add: addCrop, update: updateCrop, remove: removeCrop, setAll: setAllCrops } =
  cropsSlice.actions;
