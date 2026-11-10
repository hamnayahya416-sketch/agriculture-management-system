/* Shared fetch wrapper: timeouts and consistent, human friendly errors. */

export async function request(url, options = {}) {
  const { timeout = 12000, ...rest } = options;
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeout) : null;

  try {
    const response = await fetch(url, {
      ...rest,
      signal: controller ? controller.signal : undefined,
    });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error && error.name === "AbortError") {
      throw new Error("The request timed out. Please try again.");
    }
    if (error instanceof TypeError) {
      throw new Error("Network error. Check your internet connection.");
    }
    throw new Error(error.message || "Something went wrong while fetching data.");
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export function getJson(url, options = {}) {
  return request(url, { ...options, method: "GET" });
}
