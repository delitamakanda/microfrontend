import { atom, useAtom } from "jotai";
import { CART_STORAGE_KEY, getBrowserStorage, parseStoredCart, readCart, writeCart } from "./helpers/cartStorage.js";
const counterAtom = atom(0);

const useCount = () => useAtom(counterAtom);

// Cart atom persisted in storage (localStorage by default), kept in sync with
// other tabs through the `storage` event.
export const createCartAtom = (getStorage = getBrowserStorage, key = CART_STORAGE_KEY) => {
    const baseAtom = atom(readCart(getStorage(), key));
    baseAtom.onMount = (setAtom) => {
        setAtom(readCart(getStorage(), key));
        if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return undefined;
        const onStorage = (e) => {
            if (e.key === key || e.key === null) setAtom(parseStoredCart(e.newValue));
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    };
    return atom(
        (get) => get(baseAtom),
        (get, set, update) => {
            const next = typeof update === 'function' ? update(get(baseAtom)) : update;
            set(baseAtom, next);
            writeCart(getStorage(), next, key);
        }
    );
};

export const cartAtom = createCartAtom();

export const cartItemsQuantityAtom = atom(get => {
    const cartItems = get(cartAtom);
    return cartItems.reduce((total, item) => total + parseInt(item.quantity), 0);
});

export default useCount;
