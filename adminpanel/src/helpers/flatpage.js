export const DEFAULT_SITE_ID = 1;

const ENTITIES = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
};

// Plain-text version of an HTML string (never rendered as HTML by the caller).
export const stripHtml = (html) => {
    if (typeof html !== 'string') return '';
    return html
        .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&(nbsp|amp|lt|gt|quot|apos|#39);/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
        .replace(/\s+/g, ' ')
        .trim();
};

export const previewText = (html, max = 80) => {
    const text = stripHtml(html);
    return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text;
};

// Returns true when the Quill/PrimeReact editor value has no visible text.
export const isContentEmpty = (html) => stripHtml(html) === '' && !/<(img|iframe|video)\b/i.test(html || '');

// Django flatpage URL: starts and ends with "/", no spaces, no "//".
export const validateFlatPageUrl = (url) => {
    if (typeof url !== 'string' || url === '') return 'URL is required.';
    if (/\s/.test(url)) return 'URL must not contain spaces.';
    if (!url.startsWith('/')) return 'URL must start with "/" (e.g. /help/shipping/).';
    if (!url.endsWith('/')) return 'URL must end with "/" (e.g. /help/shipping/).';
    if (url.includes('//')) return 'URL must not contain "//".';
    return true;
};

// Slug used by the storefront: path segments joined by "-".
export const urlToSlug = (url) =>
    typeof url === 'string' ? url.split('/').filter(Boolean).join('-') : '';

export const buildFlatPagePayload = (values, existing = {}) => ({
    title: values.title.trim(),
    url: values.url.trim(),
    content: values.content,
    enable_comments: existing.enable_comments ?? false,
    registration_required: existing.registration_required ?? false,
    template_name: existing.template_name ?? '',
    sites: Array.isArray(existing.sites) && existing.sites.length ? existing.sites : [DEFAULT_SITE_ID],
});

const GENERIC_ERROR = 'Something went wrong. Please try again.';

// Normalizes a DRF error body (or an undefined response) into { message, fields }.
export const extractApiError = (response) => {
    if (!response || typeof response !== 'object') {
        return { message: GENERIC_ERROR, fields: {} };
    }
    const data = response.data;
    if (response.status === 400 && data && typeof data === 'object' && !Array.isArray(data)) {
        const fields = {};
        for (const [key, value] of Object.entries(data)) {
            if (key === 'detail') continue;
            fields[key] = Array.isArray(value) ? value.join(' ') : String(value);
        }
        if (Object.keys(fields).length) {
            return { message: Object.values(fields)[0], fields };
        }
    }
    if (data && typeof data.detail === 'string') {
        return { message: data.detail, fields: {} };
    }
    return { message: GENERIC_ERROR, fields: {} };
};

// The shared Axios interceptor swallows HTTP errors (resolves undefined), so the
// DRF error body is unavailable: detect a duplicated URL from a search result.
export const findUrlConflict = (results, url, currentId) =>
    Array.isArray(results) &&
    results.some((page) => page.url === url && String(page.id) !== String(currentId));

export const isSuccess =(response) =>
    !!response && response.status >= 200 && response.status < 300;
