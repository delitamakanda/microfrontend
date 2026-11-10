// Pure cart update: adds one unit of `product` to `cartItems` (new line or
// quantity/total incremented) and returns a new array.
export const addProductToCart = (cartItems, product) => {
    const items = cartItems ?? [];
    const price = parseFloat(product.price);
    if (items.some((item) => item.product.uuid === product.uuid)) {
        return items.map((item) =>
            item.product.uuid === product.uuid
                ? { ...item, quantity: item.quantity + 1, total: item.total + price }
                : item
        );
    }
    return [...items, { product, quantity: 1, total: price }];
};

export const MAX_CART_QUANTITY = 10;

// Highest quantity selectable for a product: 10, bounded by stock when known.
export const getMaxQuantity = (product) => {
    const stock = parseInt(product?.stock_quantity, 10);
    if (Number.isFinite(stock) && stock >= 1) {
        return Math.min(MAX_CART_QUANTITY, stock);
    }
    return MAX_CART_QUANTITY;
};

// Returns a new array with the quantity (and line total) of `uuid` updated.
export const setCartItemQuantity = (cartItems, uuid, quantity) =>
    (cartItems ?? []).map((item) =>
        item.product.uuid === uuid
            ? { ...item, quantity, total: quantity * parseFloat(item.product.price) }
            : item
    );

export const removeCartItem = (cartItems, uuid) =>
    (cartItems ?? []).filter((item) => item.product.uuid !== uuid);

export const getCartSubtotal = (cartItems) =>
    (cartItems ?? []).reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
