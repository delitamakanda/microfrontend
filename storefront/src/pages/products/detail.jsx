import { useParams, Link } from "react-router-dom";
import axiosInstance from '../../lib/api';
import { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import { UnLazyImage } from '@unlazy/react';
import { cartAtom } from "../../store";
import { ROUTES } from '../../constants';
import { formatPrice } from '../../helpers/formatters';
import { getAvailability } from '../../helpers/product';
import { addToCart as addToCartItems, getMaxQuantity } from '../../helpers/cart';
import { WishlistButton } from '../../components/WishlistButton';

const optionOf = (res, key) => {
    const value = res?.data?.[key];
    return value && typeof value === 'object' ? (value.name ?? value.label ?? null) : (value ?? null);
};

const linkClass = "text-indigo-700 underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-700";

export const ProductDetail = () => {
    const { id } = useParams();
    const [ cartItems, setCartItems ] = useAtom(cartAtom);
    const [ product, setProduct ] = useState(null);
    const [ status, setStatus ] = useState('loading'); // loading | ready | notFound | error
    const [ size, setSize ] = useState(null);
    const [ color, setColor ] = useState(null);
    const [ categories, setCategories ] = useState([]);
    const [ quantity, setQuantity ] = useState(1);
    const [ addResult, setAddResult ] = useState(null); // { added, capped }
    const [ imageFailed, setImageFailed ] = useState(false);
    const [ attempt, setAttempt ] = useState(0);

    useEffect(() => {
        let stale = false;
        setStatus('loading');
        setProduct(null);
        setSize(null);
        setColor(null);
        setCategories([]);
        setQuantity(1);
        setAddResult(null);
        setImageFailed(false);

        const safeId = encodeURIComponent(id);
        axiosInstance.get(`store/product/${safeId}/detail/`).then(res => {
            if (stale) return;
            if (res?.data) {
                setProduct(res.data);
                setStatus('ready');
            } else {
                setStatus('error');
            }
        }).catch(err => {
            if (stale) return;
            const code = err?.response?.status;
            setStatus(code === 404 || code === 400 ? 'notFound' : 'error');
        });

        // Optional extras: failures are ignored, the page stays usable.
        axiosInstance.get(`store/size/${safeId}/`).then(res => { if (!stale) setSize(optionOf(res, 'size')); }).catch(() => {});
        axiosInstance.get(`store/color/${safeId}/`).then(res => { if (!stale) setColor(optionOf(res, 'color')); }).catch(() => {});
        axiosInstance.get('store/category-list/').then(res => {
            if (!stale && Array.isArray(res?.data)) setCategories(res.data);
        }).catch(() => {});

        return () => { stale = true; };
    }, [id, attempt]);

    const addToCart = useCallback(() => {
        const result = addToCartItems(cartItems, product, quantity);
        setCartItems(result.items);
        setAddResult({ added: result.added, capped: result.capped });
    }, [product, quantity, cartItems, setCartItems]);

    if (status === 'loading') {
        return (
            <div role="status" className="flex justify-center py-16">
                <ProgressSpinner aria-label="Loading product" />
            </div>
        );
    }

    if (status === 'notFound') {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
                <Link to={ROUTES.PRODUCTS} className={`mt-4 inline-block ${linkClass}`}>Back to products</Link>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                <p role="alert" className="text-gray-900">This product could not be loaded.</p>
                <Button className="mt-4" onClick={() => setAttempt(n => n + 1)}>Try again</Button>
            </div>
        );
    }

    const availability = getAvailability(product);
    const categoryNames = (product.category ?? [])
        .map(cid => categories.find(c => c.id === cid || c.uuid === cid)?.name)
        .filter(Boolean);
    const quantityOptions = Array.from({ length: getMaxQuantity(product) }, (_, i) => i + 1);
    const showImage = product.image_url && !imageFailed;

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <Link to={ROUTES.PRODUCTS} className={`text-sm ${linkClass}`}>&larr; Back to products</Link>
            <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
                    {showImage ? (
                        <UnLazyImage src={product.image_url} alt={product.name} className="h-full w-full object-cover object-center" onError={() => setImageFailed(true)} />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-600">
                            <i className="pi pi-image text-6xl" aria-hidden="true"></i>
                            <span className="sr-only">No image available</span>
                        </div>
                    )}
                </div>
                <div className="min-w-0">
                    <h1 className="break-words text-3xl font-bold text-gray-900">{product.name}</h1>
                    <p className="mt-2 text-2xl font-medium text-gray-900">{formatPrice(product.price)}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Tag value={availability.label} severity={availability.severity} icon={availability.canBuy ? 'pi pi-check' : 'pi pi-times'} />
                        {availability.label === 'LOW STOCK' && (
                            <span className="text-sm text-gray-800">Only {product.stock_quantity} left</span>
                        )}
                    </div>
                    {categoryNames.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Categories">
                            {categoryNames.map(name => (
                                <li key={name} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-800">{name}</li>
                            ))}
                        </ul>
                    )}
                    {product.description && <p className="mt-4 whitespace-pre-line text-gray-800">{product.description}</p>}
                    {(size || color) && (
                        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-gray-800">
                            {size && (<><dt className="font-medium">Size</dt><dd>{size}</dd></>)}
                            {color && (<><dt className="font-medium">Color</dt><dd>{color}</dd></>)}
                        </dl>
                    )}
                    <div className="mt-6 flex flex-col gap-2">
                        <label htmlFor="product-quantity" className="font-medium text-gray-900">Quantity</label>
                        <Dropdown
                            inputId="product-quantity"
                            value={quantity}
                            options={quantityOptions}
                            onChange={(e) => { setQuantity(e.value); setAddResult(null); }}
                            disabled={!availability.canBuy}
                            className="min-h-[44px] w-full sm:w-32"
                        />
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <Button className="min-h-[44px] w-full justify-center sm:w-auto" onClick={addToCart} disabled={!availability.canBuy}>
                            {availability.canBuy ? 'Add to cart' : 'Out of stock'}
                        </Button>
                        <WishlistButton product={product} className="w-full justify-center sm:w-auto" />
                    </div>
                    <p aria-live="polite" className="mt-3 min-h-[1.5rem] text-gray-900">
                        {addResult && (
                            <>
                                {addResult.capped && 'Maximum quantity reached for this product. '}
                                {addResult.added > 0 && `Added ${addResult.added} to cart. `}
                                <Link to={ROUTES.CART} className={linkClass}>View cart</Link>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};
