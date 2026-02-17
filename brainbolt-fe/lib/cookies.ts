/**
 * Cookie utility functions for managing authentication tokens
 */

export const COOKIE_NAMES = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
} as const;

interface CookieOptions {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Set a cookie with the given name and value
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  const {
    days = 7,
    path = "/",
    secure = process.env.NODE_ENV === "production",
    sameSite = "lax",
  } = options;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    cookie += `; expires=${date.toUTCString()}`;
  }

  cookie += `; path=${path}`;

  if (secure) {
    cookie += "; secure";
  }

  cookie += `; SameSite=${sameSite}`;

  if (typeof document !== "undefined") {
    document.cookie = cookie;
  }
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const nameEQ = encodeURIComponent(name) + "=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, path: string = "/"): void {
  if (typeof document !== "undefined") {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  }
}

/**
 * Get the auth token from cookies
 */
export function getAuthToken(): string | null {
  return getCookie(COOKIE_NAMES.AUTH_TOKEN);
}

/**
 * Set the auth token in cookies
 */
export function setAuthToken(token: string, days: number = 7): void {
  setCookie(COOKIE_NAMES.AUTH_TOKEN, token, { days });
}

/**
 * Delete the auth token from cookies
 */
export function deleteAuthToken(): void {
  deleteCookie(COOKIE_NAMES.AUTH_TOKEN);
}

/**
 * Get user data from cookies
 */
export function getUserData(): any | null {
  const data = getCookie(COOKIE_NAMES.USER_DATA);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Set user data in cookies
 */
export function setUserData(user: any, days: number = 7): void {
  setCookie(COOKIE_NAMES.USER_DATA, JSON.stringify(user), { days });
}

/**
 * Delete user data from cookies
 */
export function deleteUserData(): void {
  deleteCookie(COOKIE_NAMES.USER_DATA);
}
