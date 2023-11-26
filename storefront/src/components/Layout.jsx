import 'primeicons/primeicons.css';

import { useAtomValue } from "jotai";
import { cartItemsQuantityAtom } from "../store";
import { useOutlet, Link } from "react-router-dom";
import ThemeSwitcher from './ThemeSwitcher';

export const Layout = () => {
    const outlet = useOutlet();
    const cartItemsQuantity = useAtomValue(cartItemsQuantityAtom);
    console.log({cartItemsQuantity});
    return (
        <div className="p-5">
            <ThemeSwitcher />
            <Link to="/cart"><i className="pi pi-shopping-cart"></i> x {cartItemsQuantity} item(s)</Link>
            <div className="my-5" />
            {outlet}
        </div>
    )
};