import { useAtom } from "jotai";
import { cartAtom, cartItemsQuantityAtom } from "../../store";
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'primereact/button';
import { CartItem } from '../../components/CartItem';
import { ROUTES } from '../../constants';
import { formatPrice } from '../../helpers/formatters';
import { getCartSubtotal } from '../../helpers/cart';

const linkClass = "text-indigo-700 underline focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-indigo-700";

export const Cart = () => {
    const [ cartItems ] = useAtom(cartAtom);
    const [ itemsCount ] = useAtom(cartItemsQuantityAtom);
    const navigate = useNavigate();

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Your cart</h1>
            {cartItems.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-lg text-gray-900">Your cart is empty</p>
                    <Link to={ROUTES.PRODUCTS} className={`mt-4 inline-block ${linkClass}`}>Continue shopping</Link>
                </div>
            ) : (
                <>
                    <ul className="mt-6" aria-label="Cart items">
                        {cartItems.map(item => (
                            <CartItem key={item.product.uuid} product={item.product} quantity={item.quantity} total={item.total} />
                        ))}
                    </ul>
                    <section aria-labelledby="cart-summary" className="mt-8 rounded-lg bg-gray-100 p-4">
                        <h2 id="cart-summary" className="text-xl font-bold text-gray-900">Summary</h2>
                        <p aria-live="polite" className="mt-3 text-gray-900">
                            Subtotal ({itemsCount} {itemsCount === 1 ? 'item' : 'items'}):{' '}
                            <span className="font-bold">{formatPrice(getCartSubtotal(cartItems))}</span>
                        </p>
                        <p className="mt-1 text-sm text-gray-800">Shipping and coupons are calculated at checkout</p>
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            <Button type="button" label="Checkout" className="min-h-[44px] w-full sm:w-auto" onClick={() => navigate(ROUTES.CHECKOUT)} />
                            <Link to={ROUTES.PRODUCTS} className={linkClass}>Continue shopping</Link>
                        </div>
                    </section>
                </>
            )}
        </div>
    )
}
