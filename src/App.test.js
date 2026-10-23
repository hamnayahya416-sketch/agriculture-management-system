import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import store from "./store";
import App from "./App";

function renderAt(path) {
  return renderToString(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
}

test("blocks protected pages for unauthenticated users", () => {
  const html = renderAt("/dashboard");
  expect(html).not.toContain("Live Weather");
  expect(html).not.toContain("Farm alerts");
});

test("renders the login page at /login", () => {
  const html = renderAt("/login");
  expect(html).toContain("AgriCore");
  expect(html).toContain("admin");
});
