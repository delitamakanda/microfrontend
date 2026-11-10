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
