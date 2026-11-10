export const DEV_REMOTE_URL = 'http://localhost:3000/assets/storefrontEntry.js';
export const DEFAULT_PROD_REMOTE_URL = 'https://resplendent-strudel-83725d.netlify.app/assets/storefrontEntry.js';

// Resolves the federation remote entry URL.
// `override` is VITE_STOREFRONT_REMOTE_URL: the site origin or the full entry URL.
export function resolveRemoteUrl(mode, override) {
    if (mode !== 'production') return DEV_REMOTE_URL;
    const value = (override || '').trim();
    if (!value) return DEFAULT_PROD_REMOTE_URL;
    if (/\.js$/.test(value)) return value;
    return `${value.replace(/\/+$/, '')}/assets/storefrontEntry.js`;
}
