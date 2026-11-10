const LOW_STOCK_MAX = 9;

// Availability derived from stock_quantity (authoritative over `status`).
export const getAvailability = (product) => {
    const raw = product?.stock_quantity;
    const quantity = raw === null || raw === undefined || raw === '' ? NaN : Number(raw);
    if (!Number.isFinite(quantity) || quantity <= 0) {
        return { label: 'OUT OF STOCK', severity: 'danger', canBuy: false };
    }
    if (quantity <= LOW_STOCK_MAX) {
        return { label: 'LOW STOCK', severity: 'warning', canBuy: true };
    }
    return { label: 'IN STOCK', severity: 'success', canBuy: true };
};

// Returns a new cart: one line per product uuid, quantity +1 per call.
export const addProductToCart = (cartItems, product) => {
    const price = parseFloat(product.price);
    const exists = cartItems.some(item => item.product.uuid === product.uuid);
    if (exists) {
        return cartItems.map(item => item.product.uuid === product.uuid
            ? { ...item, quantity: item.quantity + 1, total: item.total + price }
            : item);
    }
    return [...cartItems, { product, quantity: 1, total: price }];
};
