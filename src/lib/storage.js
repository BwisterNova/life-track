// Small localStorage helpers to (de)serialize JSON safely.
export function getJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("storage.getJSON parse error", e);
    return fallback;
  }
}

export function setJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("storage.setJSON error", e);
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn("storage.removeItem error", e);
  }
}
