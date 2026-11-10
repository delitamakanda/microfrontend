// Pure helpers for the login page. No React, no PrimeReact, no network.

export const INVALID_CREDENTIALS_MESSAGE = 'Invalid username or password.';
export const UNREACHABLE_MESSAGE = 'Unable to reach the server. Try again.';

/**
 * Maps a login failure to a user-facing message.
 * The remote's `login` rethrows `new Error('Failed to login', { cause: axiosError })`,
 * so the HTTP status is read from `error.cause` (or from the error itself).
 * 400/401 -> credentials; no response, timeout or 5xx -> server unreachable.
 */
export function getLoginErrorMessage(error) {
    const source = error?.cause ?? error;
    const status = source?.response?.status;
    if (status === 400 || status === 401) return INVALID_CREDENTIALS_MESSAGE;
    return UNREACHABLE_MESSAGE;
}

/**
 * Where to go after signing in: the route the user came from (`location.state.from`,
 * set by the protected layout), or `/`. Only internal paths are accepted and
 * `/login` itself is refused.
 */
export function getRedirectTarget(location) {
    const from = location?.state?.from;
    const pathname = typeof from === 'string' ? from : from?.pathname;
    if (typeof pathname !== 'string') return '/';
    if (!pathname.startsWith('/') || pathname.startsWith('//') || pathname.includes('\\')) return '/';
    if (pathname === '/login' || pathname.startsWith('/login/')) return '/';
    const search = typeof from === 'object' && typeof from.search === 'string' ? from.search : '';
    const hash = typeof from === 'object' && typeof from.hash === 'string' ? from.hash : '';
    return `${pathname}${search}${hash}`;
}
