import { useAtom } from "jotai";
import { cartAtom } from "../store";
import { Button } from 'primereact/button';
import { Link } from "react-router-dom";
import { ROUTES } from '../constants';
import { UnLazyImage } from '@unlazy/react'
import { formatPrice } from '../helpers/formatters';
import { addProductToCart } from '../helpers/product';


export const ProductCart = ({ product }) => {
    const [ , setCartItems] = useAtom(cartAtom);

    const addToCart = () => setCartItems(prev => addProductToCart(prev, product));

    return (
        <div className="ui-group">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <UnLazyImage src={product.image_url} alt={product.name} className="h-full w-full object-cover object-center group-hover:opacity-75" blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH" autoSizes />
            </div>
            <Link to={`${ROUTES.PRODUCTS}/${product.uuid}`}>
            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
            </Link>
            <p className="mt-1 text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
            <Button onClick={addToCart}>Add to cart</Button>
        </div>
    )
}
