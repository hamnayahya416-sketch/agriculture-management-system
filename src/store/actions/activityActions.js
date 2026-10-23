import { activitySlice } from "../reducers/activityReducer";

/* Action types: activity/log, activity/clear */
export const { log: logActivity, clear: clearActivityLog } = activitySlice.actions;
