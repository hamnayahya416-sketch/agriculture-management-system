/* Jest setup (auto-loaded by Create React App).
   react-router v7 needs TextEncoder/TextDecoder, which the
   jsdom version shipped with react-scripts does not provide. */
import { TextDecoder, TextEncoder } from "util";

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}
