export const INVALID_CREDENTIALS_MESSAGE = 'Incorrect username or password.';
export const GENERIC_LOGIN_ERROR_MESSAGE = 'Unable to sign in right now. Please try again.';

const LOOP_PATHS = ['/login', '/signup', '/forgot-password'];

// `AuthProvider.login` wraps the Axios error in `error.cause`; accept both shapes.
const getStatus = (error) => error?.cause?.response?.status ?? error?.response?.status;

export const getLoginErrorMessage = (error) =>
    getStatus(error) === 400 ? INVALID_CREDENTIALS_MESSAGE : GENERIC_LOGIN_ERROR_MESSAGE;

// Returns an internal path (with search and hash) from a react-router `location.state`,
// or `fallback` when missing, external, or pointing to an auth page (redirect loop).
export const getRedirectTarget = (state, fallback) => {
    const from = state?.from;
    const pathname = typeof from === 'string' ? from : from?.pathname;
    if (typeof pathname !== 'string') return fallback;
    if (!pathname.startsWith('/') || pathname.startsWith('//') || pathname.includes('\\')) {
        return fallback;
    }
    if (LOOP_PATHS.includes(pathname)) return fallback;
    const search = typeof from?.search === 'string' ? from.search : '';
    const hash = typeof from?.hash === 'string' ? from.hash : '';
    return `${pathname}${search}${hash}`;
};
