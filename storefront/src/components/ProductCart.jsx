import { useAtom } from "jotai";
import { cartAtom } from "../store";
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';

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
                        quantity: item.quantity + 1,
                        total: item.total + parseFloat(product.price)
                    }
                }
                return item;
            })
            setCartItems(updatedCartItem);
            return
        }
        setCartItems(prevValue => [...prevValue, {product, quantity: 1, total: parseFloat(product.price)}]);
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };
    return (
        <div className="group">
            <div className=" w-full overflow-hidden rounded-lg">
                <Image src={product.image_url} alt={product.name} width="250" height="100%" className="h-full w-full object-cover object-center group-hover:opacity-75" />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
            <Button onClick={addToCart}>Add to cart</Button>
        </div>
    )
}
