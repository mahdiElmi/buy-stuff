declare module "@boiseitguru/cookie-cutter" {
  export function get(name: string): string | undefined;
  export function set(
    name: string,
    value: string,
    options?: CookieOptions,
  ): void;

  interface CookieOptions {
    /**
     * The cookie expiration date. Use a Date object to set an expiration date, e.g., `new Date(2023, 0, 1)`.
     */
    expires?: Date;
    /**
     * The domain for the cookie.
     */
    domain?: string;
    /**
     * The path for the cookie.
     */
    path?: string;
    /**
     * Set the cookie as secure (HTTPS-only).
     */
    secure?: boolean;
    /**
     * Set the cookie as HTTP-only (not accessible from JavaScript).
     */
    httpOnly?: boolean;
    /**
     * The number of seconds the cookie will last before it expires.
     */
    maxAge?: number;
    /**
     * SameSite attribute for the cookie. Can be 'strict', 'lax', or 'none'.
     */
    sameSite?: "strict" | "lax" | "none";
  }
}
