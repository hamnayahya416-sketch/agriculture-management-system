import { useCallback, useState } from "react";
import { readStorage, removeStorage, writeStorage } from "../api/storageApi";

/* useState mirrored into localStorage, always try/catch wrapped. */
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = readStorage(key, null);
    if (stored !== null) return stored;
    if (initialValue !== undefined && initialValue !== null) {
      writeStorage(key, initialValue);
      return initialValue;
    }
    return null;
  });

  const update = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        if (resolved === null || resolved === undefined) {
          removeStorage(key);
        } else {
          writeStorage(key, resolved);
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, update];
}
