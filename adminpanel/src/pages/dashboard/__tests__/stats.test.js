import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeStats } from '../stats.js';

const ok = (total, trend, data = []) => ({ data: { total, trend, data } });

test('normalizes three valid responses', () => {
    const result = normalizeStats([ok(10, 5, [{ date: 'd', count: 1 }]), ok(2, 1), ok(3, 0)]);
    assert.equal(result.status, 'ok');
    assert.equal(result.revenue.total, 10);
    assert.deepEqual(result.revenue.data, [{ date: 'd', count: 1 }]);
    assert.equal(result.customers.trend, 0);
});

test('undefined response is an error', () => {
    assert.deepEqual(normalizeStats([ok(1, 1), undefined, ok(1, 1)]), { status: 'error' });
});

test('response without data is an error', () => {
    assert.equal(normalizeStats([ok(1, 1), {}, ok(1, 1)]).status, 'error');
    assert.equal(normalizeStats([ok(1, 1), { data: null }, ok(1, 1)]).status, 'error');
});

test('non-array data is an error', () => {
    assert.equal(normalizeStats([ok(1, 1), { data: { total: 1, trend: 1, data: 'x' } }, ok(1, 1)]).status, 'error');
});

test('null total/trend fall back to 0 and missing list to []', () => {
    const result = normalizeStats([ok(null, null), { data: { total: 4 } }, ok(1, 1)]);
    assert.equal(result.status, 'ok');
    assert.equal(result.revenue.total, 0);
    assert.equal(result.revenue.trend, 0);
    assert.deepEqual(result.orders.data, []);
});

test('invalid input is an error', () => {
    assert.equal(normalizeStats(undefined).status, 'error');
    assert.equal(normalizeStats([]).status, 'error');
});
