export const MAX_CART_QUANTITY = 10;

// Highest quantity selectable for a product: 10, bounded by stock when known.
export const getMaxQuantity = (product) => {
    const stock = parseInt(product?.stock_quantity, 10);
    if (Number.isFinite(stock) && stock >= 1) {
        return Math.min(MAX_CART_QUANTITY, stock);
    }
    return MAX_CART_QUANTITY;
};

// Pure cart update: adds `quantity` units of `product` (new line or existing
// line), the line quantity being capped at getMaxQuantity(product).
// Returns { items, added, capped }: `added` is the number of units really
// added, `capped` is true when the cap prevented adding all requested units.
// An invalid quantity (0, negative, NaN, non-integer) leaves the cart as is.
export const addToCart = (cartItems, product, quantity = 1) => {
    const items = cartItems ?? [];
    const requested = Number(quantity);
    if (!product || !Number.isInteger(requested) || requested < 1) {
        return { items, added: 0, capped: false };
    }
    const price = parseFloat(product.price);
    const existing = items.find((item) => item.product.uuid === product.uuid);
    const current = existing ? existing.quantity : 0;
    const nextQuantity = Math.min(current + requested, getMaxQuantity(product));
    const added = Math.max(nextQuantity - current, 0);
    const capped = added < requested;
    if (added === 0) return { items, added, capped };
    const line = { quantity: nextQuantity, total: nextQuantity * price };
    return {
        items: existing
            ? items.map((item) => (item === existing ? { ...item, ...line } : item))
            : [...items, { product, ...line }],
        added,
        capped,
    };
};

// Returns a new cart with `quantity` (default 1) units of `product` added.
export const addProductToCart = (cartItems, product, quantity = 1) =>
    addToCart(cartItems, product, quantity).items;

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
