export const DEFAULT_PAGE_SIZE = 10;
export const MAX_TEXT_LENGTH = 255;

// Query string of `GET store/product/` (DRF LimitOffsetPagination + SearchFilter + OrderingFilter).
// The backend sets REST_FRAMEWORK SEARCH_PARAM = "q" (the default `search` is ignored).
export const buildListQuery = ({ search = '', first = 0, rows = DEFAULT_PAGE_SIZE, sortField, sortOrder } = {}) => {
    const params = new URLSearchParams();
    const term = String(search ?? '').trim();
    if (term) params.set('q', term);
    params.set('limit', String(rows));
    params.set('offset', String(first));
    if (sortField) params.set('ordering', `${sortOrder === -1 ? '-' : ''}${sortField}`);
    return params.toString();
};

// Backend labels: "IN STOCK" | "LOW STOCK" | "OUT OF STOCK".
export const getStatusSeverity = (status) => {
    switch (String(status ?? '').replace(/\s+/g, '').toUpperCase()) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warning';
        case 'OUTOFSTOCK':
            return 'danger';
        default:
            return null;
    }
};

export const formatPrice = (value) => {
    const number = Number(value);
    if (value === null || value === undefined || value === '' || !Number.isFinite(number)) return '';
    return number.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

export const validatePrice = (value) => {
    if (value === null || value === undefined || value === '') return 'Price is required.';
    return Number(value) > 0 || 'Price must be greater than 0.';
};

export const validateQuantity = (value) => {
    if (value === null || value === undefined || value === '') return 'Quantity is required.';
    return (Number.isInteger(Number(value)) && Number(value) >= 0) || 'Quantity must be a whole number, 0 or more.';
};

export const validateImageUrl = (value) => {
    const url = String(value ?? '').trim();
    if (!url) return true;
    if (url.length > MAX_TEXT_LENGTH) return `Image URL must be at most ${MAX_TEXT_LENGTH} characters.`;
    return /^https?:\/\/\S+$/i.test(url) || 'Image URL must start with http:// or https://.';
};

export const validateDescription = (value) => {
    const text = String(value ?? '').trim();
    if (!text) return 'Description is required.';
    return text.length <= MAX_TEXT_LENGTH || `Description must be at most ${MAX_TEXT_LENGTH} characters.`;
};

// Form values (price/quantity numbers, category = uuid list) -> API payload.
export const buildProductPayload = (values) => ({
    name: String(values.name ?? '').trim(),
    description: String(values.description ?? '').trim(),
    price: Number(values.price ?? 0).toFixed(2),
    stock_quantity: Number(values.stock_quantity ?? 0),
    image_url: String(values.image_url ?? '').trim(),
    category: Array.isArray(values.category) ? [...values.category] : [],
});

// API product -> form values.
export const productToFormValues = (product) => ({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: Number(product?.price ?? 0),
    stock_quantity: Number(product?.stock_quantity ?? 0),
    image_url: product?.image_url ?? '',
    category: Array.isArray(product?.category) ? [...product.category] : [],
});
