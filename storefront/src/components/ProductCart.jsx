import { Button } from 'primereact/button';
import { Link } from "react-router-dom";
import { ROUTES } from '../constants';
import { UnLazyImage } from '@unlazy/react'
import { formatPrice } from '../helpers/formatters';
import { useAddToCart } from '../hooks/useAddToCart';
import { WishlistButton } from './WishlistButton';


export const ProductCart = ({ product }) => {
    const addToCart = useAddToCart(product);

    return (
        <div className="ui-group">
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                <UnLazyImage src={product.image_url} alt={product.name} className="h-full w-full object-cover object-center group-hover:opacity-75" blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH" autoSizes />
            </div>
            <Link to={`${ROUTES.PRODUCTS}/${product.uuid}`}>
            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
            </Link>
            <p className="mt-1 text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
            <div className="flex flex-wrap items-center gap-2">
                <Button onClick={() => addToCart(1)}>Add to cart</Button>
                <WishlistButton product={product} compact />
            </div>
        </div>
    )
}
