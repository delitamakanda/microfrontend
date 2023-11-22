import { atom, useAtom } from "jotai";
const counterAtom = atom(0);

const useCount = () => useAtom(counterAtom);

export const cartAtom = atom([]);

export const cartItemsQuantityAtom = atom(get => {
    const cartItems = get(cartAtom);
    return cartItems.reduce((total, item) => total + parseInt(item.quantity), 0);
});

export default useCount;

