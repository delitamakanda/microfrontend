import { useAtom } from 'jotai';
import { cartAtom } from '../store';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import { UnLazyImage } from '@unlazy/react'
import { Button } from './ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';


export const CartItem = ({ product, quantity, total }) => {
    const [ cartItems, setCartItems ] = useAtom(cartAtom);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const removefromCart = () => {
        const newCartItems = cartItems.filter(item => item.product.uuid!== product.uuid);
        setCartItems(newCartItems);
    };

    const setOptionsQuantity = (option) => {
        const newCartItems = cartItems.map(item => {
            if (item.product.uuid === product.uuid) {
                return {
                  ...item,
                    quantity: option,
                    total: option * parseFloat(item.product.price)
                }
            }
            return item;
        })
        setCartItems(newCartItems);
    };


    return (
        <li className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex flex-1 flex-col gap-2">
                <UnLazyImage src={product.image_url} alt={product.name} width="200" height="auto" blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH" autoSizes />
                <Link to={`${ROUTES.PRODUCTS}/${product.uuid}`} className="text-base font-semibold hover:underline">
                    {product.name}
                </Link>
                <div className="text-sm text-muted-foreground">{formatPrice(product.price)}</div>
            </div>
            <div className="flex items-center gap-3">
                <Select
                    value={String(quantity)}
                    onValueChange={(value) => setOptionsQuantity(Number(value))}
                >
                    <SelectTrigger className="w-20">
                        <SelectValue placeholder="Qty" />
                    </SelectTrigger>
                    <SelectContent>
                        {[1,2,3,4,5,6,7,8,9,10].map((value) => (
                            <SelectItem key={value} value={String(value)}>
                                {value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {quantity}
                </span>
            </div>
            <div className="text-sm font-medium text-muted-foreground">{formatPrice(total)}</div>
            <Button variant="outline" onClick={removefromCart}>
                Remove
            </Button>
        </li>
    )
};
