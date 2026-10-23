import { renderToString } from "react-dom/server";
import App from "./App";

test("renders the dashboard with crop information", () => {
  const html = renderToString(<App />);
  expect(html).toContain("Dashboard");
  expect(html).toContain("Crop Information");
  expect(html).toContain("Weather Forecast");
});
