import { useAtom } from 'jotai';
import { cartAtom } from '../store';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useState } from 'react';

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
        <li className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
                <Image src={product.image_url} alt={product.name} width="200" height="100%" className="h-10 w-10 rounded-full" />
                <Link to={`/${product.uuid}`} className="text-decoration-none">
                    <div className="fw-bold">{product.name}</div>
                </Link>
                <div className="text-muted">{formatPrice(product.price)}</div>
            </div>
            <Dropdown value={quantity} options={[1,2,3,4,5,6,7,8,9,10]} onChange={(e) => setOptionsQuantity(e.value)}  />
            <span className="badge bg-primary rounded-pill">{quantity}</span>
            <div className="text-muted">{formatPrice(total)}</div>
            <Button label="Remove" icon="pi pi-times" className="ms-2" onClick={removefromCart} />
        </li>
    )
};