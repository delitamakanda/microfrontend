import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildOrdersQuery, getPageCount, getStatusLabel, getStatusSeverity,
    normalizeOrdersResponse, shortOrderId,
} from '../orderHelpers.js';

test('buildOrdersQuery computes the offset and sorts newest first', () => {
    assert.deepEqual(buildOrdersQuery({ page: 0, pageSize: 10 }), { limit: 10, offset: 0, ordering: '-order_date' });
    assert.deepEqual(buildOrdersQuery({ page: 3, pageSize: 10 }), { limit: 10, offset: 30, ordering: '-order_date' });
    assert.deepEqual(buildOrdersQuery({ page: -2, pageSize: 0 }), { limit: 10, offset: 0, ordering: '-order_date' });
    assert.equal(buildOrdersQuery().limit, 10);
});

test('normalizeOrdersResponse maps a valid page', () => {
    const result = normalizeOrdersResponse({
        count: 12, next: 'x', previous: null,
        results: [{ uuid: 'abcdef12-3456', order_date: '2026-01-02T10:00:00Z', status: 'Shipped', total_amount: '42.50', shipping_address: ' 1 Rue X ' }],
    });
    assert.equal(result.total, 12);
    assert.equal(result.hasNext, true);
    assert.equal(result.hasPrev, false);
    const [order] = result.orders;
    assert.equal(order.reference, 'abcdef12');
    assert.equal(order.total, 42.5);
    assert.equal(order.address, '1 Rue X');
    assert.ok(order.date instanceof Date);
    assert.equal(order.status, 'Shipped');
});

test('normalizeOrdersResponse rejects invalid responses', () => {
    assert.equal(normalizeOrdersResponse(undefined), null);
    assert.equal(normalizeOrdersResponse({}), null);
    assert.equal(normalizeOrdersResponse({ results: 'x' }), null);
});

test('normalizeOrdersResponse handles an empty list and missing fields', () => {
    const empty = normalizeOrdersResponse({ count: 0, next: null, previous: null, results: [] });
    assert.deepEqual(empty, { orders: [], total: 0, hasNext: false, hasPrev: false });
    const [order] = normalizeOrdersResponse({ results: [{ uuid: 'a', order_date: 'nope', shipping_address: null }] }).orders;
    assert.equal(order.date, null);
    assert.equal(order.address, '');
    assert.equal(order.total, 0);
});

test('status helpers fall back to a neutral value', () => {
    assert.equal(getStatusSeverity('Delivered'), 'success');
    assert.equal(getStatusSeverity('Cancelled'), 'danger');
    assert.equal(getStatusSeverity('Weird'), null);
    assert.equal(getStatusLabel(undefined), 'Unknown');
    assert.equal(getStatusLabel('On The Way'), 'On The Way');
});

test('shortOrderId and getPageCount', () => {
    assert.equal(shortOrderId('1234567890'), '12345678');
    assert.equal(shortOrderId(undefined), '');
    assert.equal(getPageCount(0), 1);
    assert.equal(getPageCount(10), 1);
    assert.equal(getPageCount(11), 2);
});
