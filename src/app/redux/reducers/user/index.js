import { USER_REQUEST } from "../../utilities.js";

const initialState = {
  user: null, // { username, role, displayName } | null
  loginLoading: false,
  loginSuccess: false,
  loginError: null,
  logoutLoading: false,
  logoutError: null,
  sessionLoading: false,
  sessionError: null,
  users: [],
  usersLoading: false,
  usersError: null,
  createUserLoading: false,
  createUserError: null,
  updateUserLoading: false,
  updateUserError: null,
  removeUserLoading: false,
  removeUserError: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_REQUEST.LOGIN_REQUEST:
      return { ...state, loginLoading: true, loginSuccess: false, loginError: null };
    case USER_REQUEST.LOGIN_SUCCESS:
      return { ...state, loginLoading: false, loginSuccess: true, loginError: null, user: action.payload };
    case USER_REQUEST.LOGIN_FAILURE:
      return { ...state, loginLoading: false, loginError: action.payload || "Sign in failed." };

    case USER_REQUEST.LOGOUT_REQUEST:
      return { ...state, logoutLoading: true, logoutError: null };
    case USER_REQUEST.LOGOUT_SUCCESS:
      return { ...initialState, users: state.users };
    case USER_REQUEST.LOGOUT_FAILURE:
      return { ...state, logoutLoading: false, logoutError: action.payload || "Sign out failed." };

    case USER_REQUEST.GET_USER_REQUEST:
      return { ...state, sessionLoading: true, sessionError: null };
    case USER_REQUEST.GET_USER_SUCCESS:
      return { ...state, sessionLoading: false, user: action.payload || null };
    case USER_REQUEST.GET_USER_FAILURE:
      return { ...state, sessionLoading: false, sessionError: action.payload };

    case USER_REQUEST.GET_ALL_USERS_REQUEST:
      return { ...state, usersLoading: true, usersError: null };
    case USER_REQUEST.GET_ALL_USERS_SUCCESS:
      return { ...state, usersLoading: false, users: Array.isArray(action.payload) ? action.payload : [] };
    case USER_REQUEST.GET_ALL_USERS_FAILURE:
      return { ...state, usersLoading: false, usersError: action.payload };

    case USER_REQUEST.CREATE_USER_REQUEST:
      return { ...state, createUserLoading: true, createUserError: null };
    case USER_REQUEST.CREATE_USER_SUCCESS:
      return { ...state, createUserLoading: false, users: [...state.users, action.payload] };
    case USER_REQUEST.CREATE_USER_FAILURE:
      return { ...state, createUserLoading: false, createUserError: action.payload };

    case USER_REQUEST.UPDATE_USER_REQUEST:
      return { ...state, updateUserLoading: true, updateUserError: null };
    case USER_REQUEST.UPDATE_USER_SUCCESS:
      return {
        ...state,
        updateUserLoading: false,
        users: state.users.map((entry) =>
          String(entry.username) === String(action.payload.username)
            ? { ...entry, ...action.payload }
            : entry
        ),
      };
    case USER_REQUEST.UPDATE_USER_FAILURE:
      return { ...state, updateUserLoading: false, updateUserError: action.payload };

    case USER_REQUEST.REMOVE_USER_REQUEST:
      return { ...state, removeUserLoading: true, removeUserError: null };
    case USER_REQUEST.REMOVE_USER_SUCCESS:
      return {
        ...state,
        removeUserLoading: false,
        users: state.users.filter((entry) => String(entry.username) !== String(action.payload)),
      };
    case USER_REQUEST.REMOVE_USER_FAILURE:
      return { ...state, removeUserLoading: false, removeUserError: action.payload };

    default:
      return state;
  }
}
