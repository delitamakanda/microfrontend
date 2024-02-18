import 'primeicons/primeicons.css';

import { useAtomValue } from "jotai";
import { cartItemsQuantityAtom } from "../store";
import { useOutlet, Link } from "react-router-dom";
import ThemeSwitcher from './ThemeSwitcher';
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';
import { ROUTES } from '../constants';


export const Layout = () => {
    const outlet = useOutlet();
    const cartItemsQuantity = useAtomValue(cartItemsQuantityAtom);
    // console.log({cartItemsQuantity});
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            to: ROUTES.HOME
        },
        {
            label: 'Products',
            icon: 'pi pi-shopping-cart',
            to: ROUTES.PRODUCTS
        },
        {
            label: 'Categories',
            icon: 'pi pi-tags',
            to: ROUTES.CATEGORIES
        },
        {
            label: 'Help',
            icon: 'pi pi-question',
            to: ROUTES.HELP
        },
        {
            label: 'Shipping',
            icon: 'pi pi-truck',
            to: ROUTES.SHIPPING
        },
        {
            label: 'About',
            icon: 'pi pi-info',
            to: ROUTES.ABOUT
        }
    ].map(menuItem => ({
        label: menuItem.label,
        icon: menuItem.icon,
        template: (item, options) => {
            return (
                <Button onClick={options.onClick}>
                    <Link to={menuItem.to} className={options.className}>
                    <i className={menuItem.icon}></i>
                    <span className='ml-2'>{item.label}</span>
                    </Link>
                </Button>
            )
        }
    }));
    return (
        <div className="p-5">
            <ThemeSwitcher />
            <h1>Dearest.</h1>
            <Link to={ROUTES.CART}><i className="pi pi-shopping-cart"></i> x {cartItemsQuantity} item(s)</Link>
            <Link to={ROUTES.LOGIN}><i className="pi pi-sign-in"></i> Sign In</Link>
            <Link to={ROUTES.SIGNUP}><i className="pi pi-user-plus"></i> Register</Link>
            <Link to={ROUTES.ORDER}><i className="pi pi-shopping-cart"></i> Orders</Link>
            <div className="my-5" />
            <TabMenu model={items} pt={{
        action: {
            className: 'surface-ground'
        }
    }}  />
            <div className="my-5" />
            {outlet}
        </div>
    )
};