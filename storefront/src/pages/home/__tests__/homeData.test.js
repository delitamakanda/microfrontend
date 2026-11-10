import assert from 'node:assert/strict';
import test from 'node:test';
import {
    getActiveDeals,
    getResults,
    hasResponseData,
    getProductImageFallback,
    hasImage,
} from '../homeData.js';

const now = new Date('2026-06-15T12:00:00Z');
const deal = (start_date, end_date, slug = 'd') => ({ slug, start_date, end_date });

test('getActiveDeals keeps current deals only', () => {
    const current = deal('2026-06-01T00:00:00Z', '2026-07-01T00:00:00Z', 'current');
    const past = deal('2026-01-01T00:00:00Z', '2026-02-01T00:00:00Z', 'past');
    const future = deal('2026-08-01T00:00:00Z', '2026-09-01T00:00:00Z', 'future');
    assert.deepEqual(getActiveDeals([past, current, future], now), [current]);
});

test('getActiveDeals includes both bounds', () => {
    const starts = deal('2026-06-15T12:00:00Z', '2026-07-01T00:00:00Z');
    const ends = deal('2026-06-01T00:00:00Z', '2026-06-15T12:00:00Z');
    assert.equal(getActiveDeals([starts, ends], now).length, 2);
});

test('getActiveDeals tolerates invalid input', () => {
    assert.deepEqual(getActiveDeals(undefined, now), []);
    assert.deepEqual(getActiveDeals({}, now), []);
    assert.deepEqual(getActiveDeals([null, deal('nope', 'nope')], now), []);
});

test('getResults normalises API responses', () => {
    assert.deepEqual(getResults(undefined), []);
    assert.deepEqual(getResults({ data: {} }), []);
    assert.deepEqual(getResults({ data: { results: [] } }), []);
    assert.deepEqual(getResults({ data: { results: [{ uuid: '1' }] } }), [{ uuid: '1' }]);
});

test('hasResponseData detects the undefined resolved on HTTP errors', () => {
    assert.equal(hasResponseData(undefined), false);
    assert.equal(hasResponseData({ data: { results: [] } }), true);
});

test('image helpers', () => {
    assert.equal(getProductImageFallback({ name: ' Demo Tote Bag ' }), 'Demo Tote Bag');
    assert.equal(getProductImageFallback({}), 'Product');
    assert.equal(hasImage({ image_url: '' }), false);
    assert.equal(hasImage({ image_url: '  ' }), false);
    assert.equal(hasImage({}), false);
    assert.equal(hasImage({ image_url: 'https://x/y.png' }), true);
});
