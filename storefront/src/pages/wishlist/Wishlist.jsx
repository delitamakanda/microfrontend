/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { UnLazyImage } from '@unlazy/react';
import { wishlistAtom } from '../../store';
import { ROUTES } from '../../constants';
import { formatPrice } from '../../helpers/formatters';
import { getAvailability } from '../../helpers/product';
import { removeFromWishlist } from '../../helpers/wishlist';
import { useAddToCart } from '../../hooks/useAddToCart';

const linkClass = "text-indigo-700 underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-700";

const WishlistRow = ({ product, onRemove }) => {
    const addToCart = useAddToCart(product);
    const availability = getAvailability(product);

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
                    <Tag className="mt-1" value={availability.label} severity={availability.severity} />
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                <Button
                    type="button"
                    label="Add to cart"
                    icon="pi pi-shopping-cart"
                    aria-label={`Add ${product.name} to cart`}
                    className="min-h-[44px]"
                    disabled={!availability.canBuy}
                    onClick={() => addToCart(1)}
                />
                <Button
                    type="button"
                    label="Remove"
                    icon="pi pi-times"
                    aria-label={`Remove ${product.name} from wishlist`}
                    outlined
                    className="min-h-[44px]"
                    onClick={onRemove}
                />
            </div>
        </li>
    );
};

export const Wishlist = () => {
    const [items, setItems] = useAtom(wishlistAtom);

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Your wishlist</h1>
            <p className="mt-1 text-sm text-gray-800">Saved on this device. Prices and stock may have changed since you saved them.</p>
            {items.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-lg text-gray-900">Your wishlist is empty</p>
                    <Link to={ROUTES.PRODUCTS} className={`mt-4 inline-block ${linkClass}`}>Browse products</Link>
                </div>
            ) : (
                <ul className="mt-6" aria-label="Wishlist items">
                    {items.map(product => (
                        <WishlistRow
                            key={product.uuid}
                            product={product}
                            onRemove={() => setItems(prev => removeFromWishlist(prev, product.uuid))}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};
