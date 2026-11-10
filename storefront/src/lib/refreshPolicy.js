// Pure decision helpers for the Axios response interceptor (see api.js).

const AUTH_PATHS = ['auth/login/', 'auth/token/refresh/'];

// True for the login and refresh endpoints, whatever the URL form:
// "auth/login/", "/auth/login/" or "https://host/api/auth/login/".
export const isAuthUrl = (url) => {
    if (typeof url !== 'string') return false;
    const path = url.split(/[?#]/)[0];
    return AUTH_PATHS.some((p) => path === p || path.endsWith(`/${p}`));
};

// A token refresh is only worth trying for a 401 on a regular request that has
// not been replayed yet. No `response` (network error, timeout) never refreshes.
export const shouldRefresh = ({ status, url, retried } = {}) =>
    status === 401 && !retried && !isAuthUrl(url);
