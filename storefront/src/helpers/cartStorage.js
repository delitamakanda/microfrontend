// Pure helpers to persist the cart in a Storage-like object (localStorage).
// Every function is defensive: a missing, throwing or corrupted storage never
// raises, the cart simply falls back to empty / in-memory.
export const CART_STORAGE_KEY = 'cart';

const isValidLine = (line) =>
    line !== null &&
    typeof line === 'object' &&
    line.product !== null &&
    typeof line.product === 'object' &&
    Boolean(line.product.uuid) &&
    typeof line.quantity === 'number' &&
    Number.isFinite(line.quantity);

// Returns the stored cart, or [] for null / invalid JSON / non-array / any invalid line.
export const parseStoredCart = (raw) => {
    if (typeof raw !== 'string' || raw === '') return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.every(isValidLine) ? parsed : [];
    } catch {
        return [];
    }
};

export const serializeCart = (cartItems) => JSON.stringify(Array.isArray(cartItems) ? cartItems : []);

export const readCart = (storage, key = CART_STORAGE_KEY) => {
    try {
        return parseStoredCart(storage?.getItem(key));
    } catch {
        return [];
    }
};

export const writeCart = (storage, cartItems, key = CART_STORAGE_KEY) => {
    try {
        storage?.setItem(key, serializeCart(cartItems));
    } catch {
        // storage unavailable or full: the cart stays in memory
    }
};

export const getBrowserStorage = () => {
    try {
        return typeof window !== 'undefined' ? window.localStorage ?? null : null;
    } catch {
        return null;
    }
};
