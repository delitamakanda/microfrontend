import 'primeicons/primeicons.css';

import { useAtomValue } from "jotai";
import { cartItemsQuantityAtom } from "../store";
import { useOutlet, Link } from "react-router-dom";
import ThemeSwitcher from './ThemeSwitcher';
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';
import { ROUTES } from '../constants';
import axiosInstance from '../lib/api';
import { BASE_URL, SITE_TITLE, BLOG_URL } from '../constants';
import { useMemo, useState } from 'react';
import { capitalizeFirstLetter } from '../helpers/formatters';
import { Divider } from 'primereact/divider';

export const parseXml = (html) => {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/xml");
}

export const Layout = () => {
    const outlet = useOutlet();
    const cartItemsQuantity = useAtomValue(cartItemsQuantityAtom);
    const [staticPages, setStaticPages] = useState([]);
    // console.log({cartItemsQuantity});

    useMemo(()=> {
        axiosInstance.get(`${BASE_URL}sitemap.xml`, {
            responseType: 'text',
            headers: {
                'Accept': 'application/json',
            },
        }).then((res) => {
            const xml = parseXml(res.data).querySelectorAll('loc');
            setStaticPages(Array.from(xml).map((item) => {
                return {
                    slug: item.textContent.split('.com/')[1].replace(/\//g, '').toLowerCase(),
                    title: capitalizeFirstLetter(item.textContent.split('.com/')[1].replace(/\//g, '')),
                    url: item.textContent,
                }
            }));
        })
    },[])
    
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
            <div className="my-5" />
            <Divider />
            <footer className='md:flex'>
                <div className='grow'>
                
            {staticPages.map((item, index) => {
                return (
                    <Link className='mr-4' to={`${ROUTES.FLATPAGE}/${item.slug}`} key={index} state={item}>
            {item.title}
        </Link>
    )
})}
<a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className='text-gray-900 dark:text-gray-100'>Blog</a>
</div>
<div className='flex-none '>

{new Date().getFullYear() + ` ${SITE_TITLE} All rights reserved.`}
</div>
            </footer>
        </div>
    )
};