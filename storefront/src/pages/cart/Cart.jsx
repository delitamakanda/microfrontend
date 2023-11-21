import { useAtom } from "jotai";
import { cartAtom } from "../../store";
import { Link } from 'react-router-dom'
import { CartItem } from '../../components/CartItem';

export const Cart = () => {
    const [ cartItems ] = useAtom(cartAtom);
    console.log({ cartItems })

    return (
        <>
        Cart
        <Link to='/'>Continue shopping</Link>
        <ul className="list-group">
            {cartItems.map(item => (
                <CartItem key={item.product.uuid} product={item.product} quantity={item.quantity} total={item.total} />
            ))}
        </ul>
        </>
    )
}