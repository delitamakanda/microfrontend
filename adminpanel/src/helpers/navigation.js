// Back-office navigation. Pure logic: no React, no PrimeReact.

export const NAV_ITEMS = [
    { label: 'Dashboard', icon: 'pi pi-home', to: '/' },
    { label: 'Products', icon: 'pi pi-shopping-cart', to: '/products' },
    { label: 'Categories', icon: 'pi pi-tags', to: '/categories' },
    { label: 'Deals', icon: 'pi pi-calendar', to: '/deals' },
    { label: 'Coupons', icon: 'pi pi-tag', to: '/coupons' },
    { label: 'Pages', icon: 'pi pi-file', to: '/pages' },
    { label: 'Users', icon: 'pi pi-users', to: '/users' },
];

// Drops query string, hash and trailing slashes ("/products/?a=1" -> "/products").
function normalize(path) {
    const clean = String(path ?? '').split(/[?#]/)[0].replace(/\/+$/, '');
    return clean === '' ? '/' : clean;
}

// An entry is active on its own route and on its sub-routes; "/" only matches exactly.
export function isActiveRoute(pathname, to) {
    const current = normalize(pathname);
    const target = normalize(to);
    if (target === '/') return current === '/';
    return current === target || current.startsWith(`${target}/`);
}
