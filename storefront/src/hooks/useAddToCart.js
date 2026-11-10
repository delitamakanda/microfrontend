import { useSetAtom } from 'jotai';
import { cartAtom } from '../store';
import { addProductToCart } from '../helpers/cart';

// Returns a function adding one unit of `product` to the Jotai cart.
export const useAddToCart = (product) => {
    const setCartItems = useSetAtom(cartAtom);
    return () => setCartItems((items) => addProductToCart(items, product));
};
