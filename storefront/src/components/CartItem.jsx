/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useSetAtom } from 'jotai';
import { cartAtom } from '../store';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { ROUTES } from '../constants';
import { UnLazyImage } from '@unlazy/react'
import { formatPrice } from '../helpers/formatters';
import { getMaxQuantity, removeCartItem, setCartItemQuantity } from '../helpers/cart';

const linkClass = "text-indigo-700 underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-700";

export const CartItem = ({ product, quantity, total }) => {
    const setCartItems = useSetAtom(cartAtom);
    const max = Math.max(getMaxQuantity(product), quantity);
    const options = Array.from({ length: max }, (_, i) => i + 1);

    return (
        <li className="flex flex-col gap-4 border-b border-gray-300 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-200">
                    {product.image_url && (
                        <UnLazyImage src={product.image_url} alt={product.name} className="h-full w-full object-cover" blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH" autoSizes />
                    )}
                </div>
                <div className="min-w-0">
                    <Link to={`${ROUTES.PRODUCTS}/${product.uuid}`} className={`break-words font-bold ${linkClass}`}>
                        {product.name}
                    </Link>
                    <div className="text-gray-800">{formatPrice(product.price)}</div>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <Dropdown
                    value={quantity}
                    options={options}
                    onChange={(e) => setCartItems((items) => setCartItemQuantity(items, product.uuid, e.value))}
                    ariaLabel={`Quantity for ${product.name}`}
                    className="min-h-[44px]"
                />
                <div className="min-w-[5rem] font-medium text-gray-900">{formatPrice(total)}</div>
                <Button
                    label="Remove"
                    icon="pi pi-times"
                    aria-label={`Remove ${product.name} from cart`}
                    className="min-h-[44px]"
                    onClick={() => setCartItems((items) => removeCartItem(items, product.uuid))}
                />
            </div>
        </li>
    )
};
