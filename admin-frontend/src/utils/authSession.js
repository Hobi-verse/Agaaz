const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";

export function readStoredUser() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const userData = localStorage.getItem(USER_STORAGE_KEY);

  if (!token || !userData) {
    return null;
  }

  try {
    return JSON.parse(userData);
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}
