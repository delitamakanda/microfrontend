
export const PHONE_REG = '[+(]?[1-9][0-9 .-()]{8,}[0-9]';
export const EMAIL_REG ='[a-z0-9.-+_]+@[a-z0-9.-+_]+.[a-z]+';

export const BASE_URL = 'https://merchstoreapi.applikuapp.com/';
export const API_URL =  `${BASE_URL}api/`;

export const SITE_TITLE = 'Dearest.'

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
    FLATPAGE: '/pages',
    FORGOT_PASSWORD: '/forgot-password',
    CHECKOUT: '/checkout',
};

export const BLOG_URL = 'https://mellifluous-cocada-015edf.netlify.app/';
