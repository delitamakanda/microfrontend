import { Button } from 'primereact/button';
import { Link } from "react-router-dom";
import { ROUTES } from '../constants';
import { UnLazyImage } from '@unlazy/react'
import { formatPrice } from '../helpers/formatters';
import { useAddToCart } from '../hooks/useAddToCart';

export const ProductRow = ({ product }) => {
    const addToCart = useAddToCart(product);

    return (
        <li className="flex gap-4 py-4 border-b border-gray-200">
            <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                <UnLazyImage src={product.image_url} alt={product.name} className="h-full w-full object-cover object-center" blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH" autoSizes />
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-1">
                <Link to={`${ROUTES.PRODUCTS}/${product.uuid}`} className="text-gray-900 underline">
                    <h3 className="text-base font-medium break-words">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-700 line-clamp-2">{product.description}</p>
                <p className="text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
                {product.status && <p className="text-sm font-semibold text-gray-700">{product.status}</p>}
                <Button onClick={addToCart} className="self-stretch justify-center sm:self-start" aria-label={'Add ' + product.name + ' to cart'}>Add to cart</Button>
            </div>
        </li>
    )
}
