import { useAtom } from "jotai";
import { cartAtom } from "../store";
import { Link } from "react-router-dom";
import { ROUTES } from '../constants';
import { UnLazyImage } from '@unlazy/react'
import { formatPrice } from '../helpers/formatters';
import { Button } from "./ui/button";


export const ProductCart = ({ product }) => {
    const [ cartItems, setCartItems] = useAtom(cartAtom);
    // console.log({ cartItems })

    const addToCart = () => {
        const currentCartItem = cartItems.find(item => item.product.uuid === product.uuid);
        if (currentCartItem) {
            const updatedCartItem =cartItems.map(item => {
                if (item.product.uuid === product.uuid) {
                    return {
                      ...item,
                        quantity: item.quantity + 1,
                        total: item.total + parseFloat(product.price)
                    }
                }
                return item;
            })
            setCartItems(updatedCartItem);
            return
        }
        setCartItems(prevValue => [...prevValue, {product, quantity: 1, total: parseFloat(product.price)}]);
    }

    return (
        <div className="ui-group">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <UnLazyImage src={product.image_url} alt={product.name} className="h-full w-full object-cover object-center group-hover:opacity-75" blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH" autoSizes />
            </div>
            <Link to={`${ROUTES.PRODUCTS}/${product.uuid}`}>
            <h3 className="mt-4 text-sm font-medium text-foreground">{product.name}</h3>
            </Link>
            <p className="mt-1 text-lg font-semibold text-foreground">{formatPrice(product.price)}</p>
            <Button onClick={addToCart}>Add to cart</Button>
        </div>
    )
}
