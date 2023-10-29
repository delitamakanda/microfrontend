import { Link } from 'react-router-dom'
import { TabMenu } from "primereact/tabmenu";

export const Menu = () => {
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
        <div className="sticky top-0 z-5">
            <TabMenu model={items} />
        </div>
    )
}