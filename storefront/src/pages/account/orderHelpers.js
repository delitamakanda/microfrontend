export const PAGE_SIZE = 10;

const STATUSES = {
    'Pending': 'warning',
    'Ready': 'info',
    'On The Way': 'info',
    'Shipped': 'info',
    'Delivered': 'success',
    'Cancelled': 'danger',
};

export const buildOrdersQuery = ({ page = 0, pageSize = PAGE_SIZE } = {}) => {
    const size = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : PAGE_SIZE;
    const index = Number.isInteger(page) && page > 0 ? page : 0;
    return { limit: size, offset: index * size, ordering: '-order_date' };
};

export const shortOrderId = (uuid) => String(uuid ?? '').slice(0, 8);

export const getStatusLabel = (status) => (status ? String(status) : 'Unknown');

export const getStatusSeverity = (status) => STATUSES[status] ?? null;

export const normalizeOrder = (order) => {
    const date = order.order_date ? new Date(order.order_date) : null;
    return {
        id: order.uuid,
        reference: shortOrderId(order.uuid),
        date: date && !Number.isNaN(date.getTime()) ? date : null,
        status: getStatusLabel(order.status),
        severity: getStatusSeverity(order.status),
        total: Number(order.total_amount) || 0,
        address: String(order.shipping_address ?? '').trim(),
    };
};

// Returns null when the response is not a paginated list (the API client may resolve to undefined on errors).
export const normalizeOrdersResponse = (data) => {
    if (!data || !Array.isArray(data.results)) return null;
    return {
        orders: data.results.map(normalizeOrder),
        total: Number.isFinite(data.count) ? data.count : data.results.length,
        hasNext: Boolean(data.next),
        hasPrev: Boolean(data.previous),
    };
};

export const getPageCount = (total, pageSize = PAGE_SIZE) => Math.max(1, Math.ceil(total / pageSize));
