import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildListQuery,
    getStatusSeverity,
    formatPrice,
    validatePrice,
    validateQuantity,
    validateImageUrl,
    validateDescription,
    buildProductPayload,
    productToFormValues,
} from '../product.js';

test('buildListQuery uses q (the backend SEARCH_PARAM, not search), limit, offset and ordering', () => {
    const query = new URLSearchParams(buildListQuery({ search: 'Demo', first: 20, rows: 10, sortField: 'price', sortOrder: 1 }));
    assert.equal(query.get('q'), 'Demo');
    assert.equal(query.get('search'), null);
    assert.equal(query.get('limit'), '10');
    assert.equal(query.get('offset'), '20');
    assert.equal(query.get('ordering'), 'price');
});

test('buildListQuery prefixes descending ordering and omits empty search/ordering', () => {
    const query = new URLSearchParams(buildListQuery({ sortField: 'created_at', sortOrder: -1 }));
    assert.equal(query.get('ordering'), '-created_at');
    assert.equal(query.has('q'), false);
    const bare = new URLSearchParams(buildListQuery({ search: '   ' }));
    assert.equal(bare.has('q'), false);
    assert.equal(bare.has('ordering'), false);
    assert.equal(bare.get('limit'), '10');
    assert.equal(bare.get('offset'), '0');
});

test('buildListQuery encodes special characters', () => {
    const raw = buildListQuery({ search: 'a&b=c #1' });
    assert.ok(!raw.includes('a&b'));
    assert.equal(new URLSearchParams(raw).get('q'), 'a&b=c #1');
});

test('getStatusSeverity maps the backend labels', () => {
    assert.equal(getStatusSeverity('IN STOCK'), 'success');
    assert.equal(getStatusSeverity('LOW STOCK'), 'warning');
    assert.equal(getStatusSeverity('OUT OF STOCK'), 'danger');
    assert.equal(getStatusSeverity('INSTOCK'), 'success');
    assert.equal(getStatusSeverity('whatever'), null);
    assert.equal(getStatusSeverity(undefined), null);
});

test('formatPrice formats dollars and tolerates bad input', () => {
    assert.equal(formatPrice('12.00'), '$12.00');
    assert.equal(formatPrice(1234.5), '$1,234.50');
    assert.equal(formatPrice(undefined), '');
    assert.equal(formatPrice('abc'), '');
});

test('validators', () => {
    assert.equal(validatePrice(1), true);
    assert.notEqual(validatePrice(0), true);
    assert.notEqual(validatePrice(-3), true);
    assert.notEqual(validatePrice(null), true);
    assert.equal(validateQuantity(0), true);
    assert.notEqual(validateQuantity(-1), true);
    assert.notEqual(validateQuantity(1.5), true);
    assert.equal(validateImageUrl(''), true);
    assert.equal(validateImageUrl('https://x.test/a.png'), true);
    assert.notEqual(validateImageUrl('javascript:alert(1)'), true);
    assert.notEqual(validateImageUrl(`https://x.test/${'a'.repeat(260)}`), true);
    assert.equal(validateDescription('ok'), true);
    assert.notEqual(validateDescription('  '), true);
    assert.notEqual(validateDescription('a'.repeat(256)), true);
});

test('buildProductPayload sends categories as uuid list, numbers and empty image', () => {
    assert.deepEqual(
        buildProductPayload({ name: ' Tee ', description: 'd', price: 12, stock_quantity: '3', image_url: '  ', category: ['a', 'b'] }),
        { name: 'Tee', description: 'd', price: '12.00', stock_quantity: 3, image_url: '', category: ['a', 'b'] }
    );
    assert.deepEqual(buildProductPayload({ name: 'x', description: 'y' }).category, []);
});

test('productToFormValues converts API values', () => {
    assert.deepEqual(
        productToFormValues({ name: 'A', description: 'B', price: '9.50', stock_quantity: 4, image_url: null, category: ['u'] }),
        { name: 'A', description: 'B', price: 9.5, stock_quantity: 4, image_url: '', category: ['u'] }
    );
    assert.deepEqual(productToFormValues(null).category, []);
});
