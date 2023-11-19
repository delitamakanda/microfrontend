import { useAtomValue } from "jotai";
import { cartItemsQuantityAtom } from "../store";

export const Layout = ({ children }) => {
    const cartItemsQuantity = useAtomValue(cartItemsQuantityAtom);
    console.log({cartItemsQuantity});
    return (
        <div className="container">
            x {cartItemsQuantity} item(s)
            {children}
        </div>
    )
};