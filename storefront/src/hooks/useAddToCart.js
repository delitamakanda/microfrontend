import { useSetAtom } from 'jotai';
import { cartAtom } from '../store';
import { addProductToCart } from '../helpers/cart';

// Returns a function adding `quantity` (default 1) units of `product` to the
// Jotai cart, capped at the maximum allowed for the product.
export const useAddToCart = (product) => {
    const setCartItems = useSetAtom(cartAtom);
    return (quantity = 1) => setCartItems((items) => addProductToCart(items, product, quantity));
};
