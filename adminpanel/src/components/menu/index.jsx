import { Link } from 'react-router-dom'
import { TabMenu } from "primereact/tabmenu";
import { useAuth } from '../../hooks/auth/useAuth';

export const Menu = () => {
    const { logout } = useAuth();
    const items = [
        {
            label: 'Dashboards',
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
        }
    ].map(menuItem => ({
        label: menuItem.label,
        icon: menuItem.icon,
        template: (item, options) => {
            
            return (
                <div onClick={options.onClick}>
                    <Link to={menuItem.to} className={options.className}>
                    <i className={menuItem.icon}></i>
                    <span className='ml-2'>{item.label}</span>
                    </Link>
                </div>
            )
        }
    }))
    return (
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <TabMenu model={items} />
            </div>
        </nav>
    )
}