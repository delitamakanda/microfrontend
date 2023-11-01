import { BreadCrumb } from "primereact/breadcrumb";
import { useLocation } from "react-router-dom";

export const Breadcrumb = () => {
    const { pathname } = useLocation();
    const matches = pathname.split('/').filter((match) => Boolean(match));
    let items = matches.map((match, index) => {
        const url = matches.slice(0, index + 1).join('/');
        return {
            label: match.charAt(0).toUpperCase() + match.slice(1),
            url
        };
    });
    if (items.length === 0) {
        items.push({
            label: 'Dashboard',
            url: '/',
        })
    }
    // console.log(items);

    return (
        items.length > 0 ? <BreadCrumb className="surface-ground pl-0 border-none" model={items} home={{ icon: 'pi pi-home', url: '/'}}  /> : null
    );
}