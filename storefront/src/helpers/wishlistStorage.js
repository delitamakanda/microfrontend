// Pure helpers to persist the wishlist in a Storage-like object (localStorage).
// Same defensive approach as cartStorage.js: never raises.
export const WISHLIST_STORAGE_KEY = 'wishlist';

const isValidEntry = (entry) =>
    entry !== null &&
    typeof entry === 'object' &&
    typeof entry.uuid === 'string' &&
    entry.uuid !== '';

// Returns the stored wishlist, or [] for null / invalid JSON / non-array / any invalid entry.
export const parseStoredWishlist = (raw) => {
    if (typeof raw !== 'string' || raw === '') return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.every(isValidEntry) ? parsed : [];
    } catch {
        return [];
    }
};

export const serializeWishlist = (items) => JSON.stringify(Array.isArray(items) ? items : []);

export const readWishlist = (storage, key = WISHLIST_STORAGE_KEY) => {
    try {
        return parseStoredWishlist(storage?.getItem(key));
    } catch {
        return [];
    }
};

export const writeWishlist = (storage, items, key = WISHLIST_STORAGE_KEY) => {
    try {
        storage?.setItem(key, serializeWishlist(items));
    } catch {
        // storage unavailable or full: the wishlist stays in memory
    }
};
