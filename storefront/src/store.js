import { atom, useAtom } from "jotai";
import { CART_STORAGE_KEY, getBrowserStorage, parseStoredCart, readCart, writeCart } from "./helpers/cartStorage.js";
import { WISHLIST_STORAGE_KEY, parseStoredWishlist, readWishlist, writeWishlist } from "./helpers/wishlistStorage.js";
const counterAtom = atom(0);

const useCount = () => useAtom(counterAtom);

// Atom persisted in storage (localStorage by default), kept in sync with
// other tabs through the `storage` event.
const createPersistedAtom = ({ read, parse, write }, getStorage, key) => {
    const baseAtom = atom(read(getStorage(), key));
    baseAtom.onMount = (setAtom) => {
        setAtom(read(getStorage(), key));
        if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return undefined;
        const onStorage = (e) => {
            if (e.key === key || e.key === null) setAtom(parse(e.newValue));
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    };
    return atom(
        (get) => get(baseAtom),
        (get, set, update) => {
            const next = typeof update === 'function' ? update(get(baseAtom)) : update;
            set(baseAtom, next);
            write(getStorage(), next, key);
        }
    );
};

export const createCartAtom = (getStorage = getBrowserStorage, key = CART_STORAGE_KEY) =>
    createPersistedAtom({ read: readCart, parse: parseStoredCart, write: writeCart }, getStorage, key);

export const createWishlistAtom = (getStorage = getBrowserStorage, key = WISHLIST_STORAGE_KEY) =>
    createPersistedAtom({ read: readWishlist, parse: parseStoredWishlist, write: writeWishlist }, getStorage, key);

export const cartAtom = createCartAtom();

export const wishlistAtom = createWishlistAtom();

export const wishlistCountAtom = atom(get => get(wishlistAtom).length);

export const cartItemsQuantityAtom = atom(get => {
    const cartItems = get(cartAtom);
    return cartItems.reduce((total, item) => total + parseInt(item.quantity), 0);
});

export default useCount;
