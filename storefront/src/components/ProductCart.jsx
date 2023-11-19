import { useAtom } from "jotai";
import { cartAtom } from "../store";

export const ProductCart = ({ product }) => {
    const [ cartItems, setCartItems] = useAtom(cartAtom);
    console.log({ cartItems })

    const addToCart = () => {
        const currentCartItem = cartItems.find(item => item.product.uuid === product.uuid);
        if (currentCartItem) {
            const updatedCartItem =cartItems.map(item => {
                if (item.product.uuid === product.uuid) {
                    return {
                      ...item,
                        quantity: item.quantity + 1
                    }
                }
                return item;
            })
            setCartItems(updatedCartItem);
            return
        }
        setCartItems(prevValue => [...prevValue, {product, quantity: 1}]);
    }
    return (
        <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
                <img src={product.image_url} alt={product.name} width="250" height="auto" />
                <div className="fw-bold">{product.name}</div>
                <small className="text-muted">{product.price}</small>
            </div>
            <button className="btn btn-outline-primary" onClick={addToCart}>Add to cart</button>
        </li>
    )
}
