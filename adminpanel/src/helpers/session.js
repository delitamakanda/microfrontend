// Session helpers for the back office. Pure logic: no React, no PrimeReact.

// Keys written by the storefront remote's AuthProvider (JSON-encoded values).
export const SESSION_KEYS = ['token', 'refresh', 'user'];

// Only staff accounts may use the back office.
export function isStaffUser(user) {
    return Boolean(user && typeof user === 'object' && user.is_staff === true);
}

export function clearStoredSession(storage) {
    if (!storage) return;
    for (const key of SESSION_KEYS) {
        try {
            storage.removeItem(key);
        } catch {
            // Storage unavailable (private mode, quota…): nothing else to clear.
        }
    }
}

/**
 * Signs out even when the API call fails (expired token, network error):
 * the remote's `logout` only clears its state on a 200, which would leave
 * the user stuck. Falls back to clearing the stored session.
 * Resolves to true when the API logout succeeded.
 */
export async function signOut(logout, storage) {
    try {
        await logout?.();
        return true;
    } catch {
        clearStoredSession(storage);
        return false;
    }
}
