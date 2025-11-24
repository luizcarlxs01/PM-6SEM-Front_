const TOKEN_KEY = "token";

export function getAuthHeaders() {
  if (typeof window === "undefined") return {};

  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return {};

  return {
    Authorization: `Bearer ${token}`,
  };
}
