const KEY_ACCESS = 'access_token';
const KEY_REFRESH = 'refresh_token';
const KEY_USER = 'logged_user';

export const localTokenStorage = {
  saveSession(access: string, refresh: string, user: Record<string, unknown>): void {
    localStorage.setItem(KEY_ACCESS, access);
    localStorage.setItem(KEY_REFRESH, refresh);
    localStorage.setItem(KEY_USER, JSON.stringify(user));
  },

  getAccessToken(): string | null {
    return localStorage.getItem(KEY_ACCESS);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(KEY_REFRESH);
  },

  getStoredUser<T>(): T | null {
    const raw = localStorage.getItem(KEY_USER);
    return raw ? (JSON.parse(raw) as T) : null;
  },

  updateTokens(access: string, refresh?: string | null): void {
    localStorage.setItem(KEY_ACCESS, access);
    if (refresh) {
      localStorage.setItem(KEY_REFRESH, refresh);
    }
  },

  clear(): void {
    localStorage.removeItem(KEY_ACCESS);
    localStorage.removeItem(KEY_REFRESH);
    localStorage.removeItem(KEY_USER);
  },
};
