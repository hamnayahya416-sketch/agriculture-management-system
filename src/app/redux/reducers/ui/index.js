import { UI } from "../../utilities.js";
import { KEYS, readValue } from "../../api/index.js";

/* Theme + sidebar state is restored from storage when the store is created. */
function hydrate() {
  const saved = readValue(KEYS.ui, null);
  return {
    theme: saved && saved.theme === "dark" ? "dark" : "light",
    sidebarCollapsed: Boolean(saved && saved.sidebarCollapsed),
  };
}

const saved = hydrate();

const initialState = {
  theme: saved.theme,
  toast: null,
  sidebarOpen: false,
  sidebarCollapsed: saved.sidebarCollapsed,
};

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case UI.SETTHEME:
      return { ...state, theme: action.payload === "dark" ? "dark" : "light" };
    case UI.TOGGLETHEME:
      return { ...state, theme: state.theme === "dark" ? "light" : "dark" };

    case UI.SHOWTOAST:
      return {
        ...state,
        toast: {
          id: (action.payload && action.payload.id) || `toast-${Date.now()}`,
          message: (action.payload && action.payload.message) || "",
          tone: (action.payload && action.payload.tone) || "success",
        },
      };
    case UI.HIDETOAST:
      return { ...state, toast: null };

    case UI.TOGGLESIDEBAR:
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case UI.OPENSIDEBAR:
      return { ...state, sidebarOpen: true };
    case UI.CLOSESIDEBAR:
      return { ...state, sidebarOpen: false };

    case UI.SETSIDEBARCOLLAPSED:
      return { ...state, sidebarCollapsed: Boolean(action.payload) };
    case UI.TOGGLESIDEBARCOLLAPSED:
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    default:
      return state;
  }
}
