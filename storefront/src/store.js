import { atom, useAtom } from "jotai";
const counterAtom = atom(0);
import axiosInstance from './lib/api';

const useCount = () => useAtom(counterAtom);

const articleData = atom(async () => {
    const response = await axiosInstance.get(`store/product/?ordering=-created_at`);
    return response.data;
});

export const useArticleData = () => useAtom(articleData);

export const cartAtom = atom([]);

export const cartItemsQuantityAtom = atom(get => {
    const cartItems = get(cartAtom);
    return cartItems.reduce((total, item) => total + parseInt(item.quantity), 0);
});

export default useCount;

