import { USER_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/users/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */

export function LOGIN(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(USER_REQUEST.LOGIN_REQUEST));
      const res = await api.login(data && data.username, data && data.password);
      if (res.data.succeeded) {
        dispatch(SUCCESS(USER_REQUEST.LOGIN_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(USER_REQUEST.LOGIN_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not sign in.";
      dispatch(FAILURE(USER_REQUEST.LOGIN_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function LOGOUT(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(USER_REQUEST.LOGOUT_REQUEST));
      const res = await api.logout(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(USER_REQUEST.LOGOUT_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(USER_REQUEST.LOGOUT_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not sign out.";
      dispatch(FAILURE(USER_REQUEST.LOGOUT_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

/* Rehydrates the signed-in user from localStorage on app start. */
export function RESTORESESSION(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(USER_REQUEST.GET_USER_REQUEST));
      const res = await api.getSession(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(USER_REQUEST.GET_USER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(USER_REQUEST.GET_USER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not restore the session.";
      dispatch(FAILURE(USER_REQUEST.GET_USER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function GETALLUSERS(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(USER_REQUEST.GET_ALL_USERS_REQUEST));
      const res = await api.getAllUsers(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(USER_REQUEST.GET_ALL_USERS_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(USER_REQUEST.GET_ALL_USERS_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not load users.";
      dispatch(FAILURE(USER_REQUEST.GET_ALL_USERS_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function CREATEUSER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(USER_REQUEST.CREATE_USER_REQUEST));
      const res = await api.createUser(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(USER_REQUEST.CREATE_USER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(USER_REQUEST.CREATE_USER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not create the user.";
      dispatch(FAILURE(USER_REQUEST.CREATE_USER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function UPDATEUSER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(USER_REQUEST.UPDATE_USER_REQUEST));
      const { username, ...changes } = data || {};
      const res = await api.updateUser(username, changes);
      if (res.data.succeeded) {
        dispatch(SUCCESS(USER_REQUEST.UPDATE_USER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(USER_REQUEST.UPDATE_USER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not update the user.";
      dispatch(FAILURE(USER_REQUEST.UPDATE_USER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}

export function REMOVEUSER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(USER_REQUEST.REMOVE_USER_REQUEST));
      const res = await api.removeUser(data);
      if (res.data.succeeded) {
        dispatch(SUCCESS(USER_REQUEST.REMOVE_USER_SUCCESS, res.data.data));
        if (moveToNext) moveToNext(res.data.data);
      } else {
        dispatch(FAILURE(USER_REQUEST.REMOVE_USER_FAILURE, res.data.message));
        if (failure) failure(res.data.message);
      }
    } catch (err) {
      const message = err.message || "Could not remove the user.";
      dispatch(FAILURE(USER_REQUEST.REMOVE_USER_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
