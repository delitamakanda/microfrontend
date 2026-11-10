export const CATEGORY_PARAM = 'category';
export const PRODUCTS_PATH = '/products';

// Link to the product list filtered on one category (name is URL-encoded).
export const buildCategoryLink = (name) =>
    `${PRODUCTS_PATH}?${CATEGORY_PARAM}=${encodeURIComponent(name)}`;

// Reads the `category` params and keeps only names that exist in `categories`
// (case-insensitive, deduplicated). Returns the canonical names: an empty
// array means "All".
export const parseCategoryParams = (searchParams, categories = []) => {
    const requested = searchParams?.getAll?.(CATEGORY_PARAM) ?? [];
    const known = new Map(
        (categories ?? []).filter((c) => c?.name).map((c) => [c.name.toLowerCase(), c.name])
    );
    const result = [];
    requested.forEach((value) => {
        const name = known.get(String(value).trim().toLowerCase());
        if (name && !result.includes(name)) result.push(name);
    });
    return result;
};

// Returns a copy of `searchParams` with the `category` params replaced by the
// selection (an empty selection, i.e. "All", removes the param).
export const serializeCategoryParams = (selected = [], searchParams = new URLSearchParams()) => {
    const params = new URLSearchParams(searchParams);
    params.delete(CATEGORY_PARAM);
    selected.forEach((name) => params.append(CATEGORY_PARAM, name));
    return params;
};

// Query string (without leading `?`) for `store/product/`. Every value is
// encoded, and an empty selection ("All") sends no `category_name_in`.
export const buildProductQuery = ({ names = [], search = '', limit = 10, offset = 0, ordering = '' } = {}) => {
    const parts = [];
    if (names.length > 0) parts.push(`category_name_in=${names.map(encodeURIComponent).join(',')}`);
    if (search) parts.push(`q=${encodeURIComponent(search)}`);
    parts.push(`limit=${encodeURIComponent(limit)}`, `offset=${encodeURIComponent(offset)}`);
    if (ordering) parts.push(`ordering=${encodeURIComponent(ordering)}`);
    return parts.join('&');
};
