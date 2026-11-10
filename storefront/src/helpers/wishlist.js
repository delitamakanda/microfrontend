// Pure wishlist helpers. The wishlist is an array of product snapshots
// ({ uuid, name, price, image_url, stock_quantity }): price and stock may be stale.

export const toWishlistEntry = (product) => ({
    uuid: product.uuid,
    name: product.name,
    price: product.price,
    image_url: product.image_url ?? null,
    stock_quantity: product.stock_quantity,
});

export const isInWishlist = (items, uuid) =>
    Boolean(uuid) && (items ?? []).some((item) => item.uuid === uuid);

// Adds a snapshot of `product`; null / uuid-less products and duplicates are ignored.
export const addToWishlist = (items, product) => {
    const list = items ?? [];
    if (!product || !product.uuid || isInWishlist(list, product.uuid)) return list;
    return [...list, toWishlistEntry(product)];
};

export const removeFromWishlist = (items, uuid) =>
    (items ?? []).filter((item) => item.uuid !== uuid);

export const toggleWishlist = (items, product) => {
    const list = items ?? [];
    if (!product || !product.uuid) return list;
    return isInWishlist(list, product.uuid)
        ? removeFromWishlist(list, product.uuid)
        : addToWishlist(list, product);
};

export const getWishlistLabel = (count) => {
    const n = Number.isFinite(count) && count > 0 ? count : 0;
    return `Wishlist, ${n} ${n === 1 ? 'item' : 'items'}`;
};
