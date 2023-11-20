import { useAtomValue } from "jotai";
import { cartItemsQuantityAtom } from "../store";

export const Layout = ({ children }) => {
    const cartItemsQuantity = useAtomValue(cartItemsQuantityAtom);
    console.log({cartItemsQuantity});
    return (
        <div className="p-5">
            x {cartItemsQuantity} item(s)
            <div className="my-5" />
            {children}
        </div>
    )
};