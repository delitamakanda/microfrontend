
export const PHONE_REG = '[+(]?[1-9][0-9 .-()]{8,}[0-9]';
export const EMAIL_REG = '[a-z0-9.-+_]+@[a-z0-9.-+_]+.[a-z]+';

// Racine de l'API Django (dépôt merch_store), avec un « / » final. Lue au build :
// VITE_API_URL=http://127.0.0.1:8000/ pour l'API locale (voir .env.example).
// L'admin reçoit cette valeur via le remote fédéré storefrontApp/api.
const env = import.meta.env ?? {};
export const BASE_URL = env.VITE_API_URL || 'https://merchstoreapi.applikuapp.com/';
export const API_URL = `${BASE_URL}api/`;

export const SITE_TITLE = 'Dearest.'

export const ROUTES = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: ':id',
    CART: '/cart',
    WISHLIST: '/wishlist',
    ORDER: '/order',
    ORDER_DETAIL: ':id',
    CATEGORIES: '/categories',
    FLATPAGE: '/pages',
    FORGOT_PASSWORD: '/forgot-password',
    CHECKOUT: '/checkout',
    DEAL: '/deals',
};

export const BLOG_URL = 'https://mellifluous-cocada-015edf.netlify.app/';

// Comptes sociaux de la boutique (URL à confirmer par l'équipe produit).
export const SOCIAL_LINKS = [
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: 'pi pi-instagram' },
    { label: 'Facebook', href: 'https://www.facebook.com/', icon: 'pi pi-facebook' },
    { label: 'X (Twitter)', href: 'https://x.com/', icon: 'pi pi-twitter' },
    { label: 'GitHub', href: 'https://github.com/delitamakanda/microfrontend', icon: 'pi pi-github' },
];

export const randomColors = [
    '#f4d1f1',
    '#d2fbff',
    '#fdbc5a',
    '#8e8fff',
    '#f883ef',
    '#8ef1a4',
    '#ebdbf6',
    '#f9ff81',
    '#ff88ee',
    '#ee8899',
    '#88ee99',
    '#8899ee',
    '#88eeff',
]