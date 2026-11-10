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
