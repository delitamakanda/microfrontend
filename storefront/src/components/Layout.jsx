import 'primeicons/primeicons.css';

import { useAtomValue } from "jotai";
import { cartItemsQuantityAtom } from "../store";
import { useOutlet, Link } from "react-router-dom";
import ThemeSwitcher from './ThemeSwitcher';
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';


export const Layout = () => {
    const outlet = useOutlet();
    const cartItemsQuantity = useAtomValue(cartItemsQuantityAtom);
    console.log({cartItemsQuantity});
    const items = [
        {
            label: 'Home',
            icon: 'pi pi-home',
            to: '/'
        },
        {
            label: 'Products',
            icon: 'pi pi-shopping-cart',
            to: '/products'
        },
        {
            label: 'Categories',
            icon: 'pi pi-tags',
            to: '/categories'
        },
        {
            label: 'Help',
            icon: 'pi pi-question',
            to: '/help'
        },
        {
            label: 'Shipping',
            icon: 'pi pi-truck',
            to: '/shipping'
        },
        {
            label: 'About',
            icon: 'pi pi-info',
            to: '/about'
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
            <Link to="/cart"><i className="pi pi-shopping-cart"></i> x {cartItemsQuantity} item(s)</Link>
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