export const PHONE_REG = '[+(]?[1-9][0-9 .-()]{8,}[0-9]';
export const EMAIL_REG ='[a-z0-9.-+_]+@[a-z0-9.-+_]+.[a-z]+';

export const BASE_URL = 'https://merchstoreapi.applikuapp.com/api/';

export const ROUTES = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: ':id',
    CART: '/cart',
    ORDER: '/order',
    ORDER_DETAIL: ':id',
    ACCOUNT: '/account',
    CATEGORIES: '/categories',
    HELP: '/help',
    SHIPPING: '/shipping',
    ABOUT: '/about',
    FORGOT_PASSWORD: '/forgot-password',
    CHECKOUT: '/checkout',
};
