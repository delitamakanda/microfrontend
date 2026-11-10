/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useAtom } from 'jotai';
import { Button } from 'primereact/button';
import { wishlistAtom } from '../store';
import { isInWishlist, toggleWishlist } from '../helpers/wishlist';

// Heart toggle adding / removing `product` from the local wishlist.
// `compact` renders an icon-only button (product cards and rows).
export const WishlistButton = ({ product, compact = false, className = '' }) => {
    const [items, setItems] = useAtom(wishlistAtom);
    const active = isInWishlist(items, product.uuid);
    const label = active ? 'Remove from wishlist' : 'Add to wishlist';
    const ariaLabel = `${label}: ${product.name}`;

    return (
        <Button
            type="button"
            icon={active ? 'pi pi-heart-fill' : 'pi pi-heart'}
            label={compact ? undefined : label}
            aria-label={compact ? ariaLabel : undefined}
            aria-pressed={active}
            outlined
            className={`min-h-[44px] ${compact ? 'min-w-[44px] justify-center' : ''} ${className}`}
            onClick={() => setItems((prev) => toggleWishlist(prev, product))}
        />
    );
};
