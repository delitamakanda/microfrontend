// Logique pure de la page d'accueil (sans JSX, testable avec node:test).

export const HERO_TEXT = {
    title: 'Dearest.',
    tagline: 'Discover our latest pieces.',
    shopNow: 'Shop now',
    browseCategories: 'Browse categories',
};

// Les erreurs HTTP non 401 résolvent `undefined` dans l'intercepteur d'api.js :
// on teste donc explicitement `response?.data`.
export const getResults = (response) => {
    const results = response?.data?.results;
    return Array.isArray(results) ? results : [];
};

export const hasResponseData = (response) => Boolean(response?.data);

// Promotions en cours : start_date <= now <= end_date (bornes incluses).
export const getActiveDeals = (deals, now = new Date()) => {
    if (!Array.isArray(deals)) {
        return [];
    }
    const current = new Date(now).getTime();
    return deals.filter((deal) => {
        const start = new Date(deal?.start_date).getTime();
        const end = new Date(deal?.end_date).getTime();
        return start <= current && current <= end;
    });
};

export const getProductImageFallback = (product) => {
    const name = String(product?.name ?? '').trim();
    return name || 'Product';
};

export const hasImage = (item) => typeof item?.image_url === 'string' && item.image_url.trim() !== '';
