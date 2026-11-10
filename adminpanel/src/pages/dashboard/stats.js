const normalizeOne = (response) => {
    const payload = response?.data;
    if (!payload || typeof payload !== 'object') {
        return null;
    }
    if (payload.data !== undefined && !Array.isArray(payload.data)) {
        return null;
    }
    return {
        total: payload.total ?? 0,
        trend: payload.trend ?? 0,
        data: payload.data ?? [],
    };
};

/**
 * Turns the three KPI responses [revenue, orders, customers] into a state.
 * An older remote resolves to undefined on HTTP errors: that is an error too.
 */
export const normalizeStats = (responses) => {
    if (!Array.isArray(responses) || responses.length !== 3) {
        return { status: 'error' };
    }
    const [revenue, orders, customers] = responses.map(normalizeOne);
    if (!revenue || !orders || !customers) {
        return { status: 'error' };
    }
    return { status: 'ok', revenue, orders, customers };
};
