import { BreadCrumb } from "primereact/breadcrumb";
import { classNames } from "primereact/utils";
import { Link } from "react-router-dom";

export const Breadcrumb = () => {
    const items = [].map((breadcrumb) => ({
        label: breadcrumb.label,
        to: breadcrumb.to,
        template: (item, options) => {
            return breadcrumb.href ? (<Link to={breadcrumb.href} className={classNames('text-color', options.className)}>
                <i className={item.icon} />
                <span className='ml-2'>{item.label}</span>
            </Link>) : (<span>
                <span className="p-2">{item.label}</span>
            </span>)
        }
    }));
    return (
        items.length > 0 ? <BreadCrumb className="surface-ground pl-0 border-none" model={items} /> : null
    )
}