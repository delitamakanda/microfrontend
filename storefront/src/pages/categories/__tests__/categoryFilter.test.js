import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildCategoryLink,
    buildProductQuery,
    parseCategoryParams,
    serializeCategoryParams,
} from '../categoryFilter.js';

const categories = [{ name: 'Clothing' }, { name: 'Home & Garden' }, { name: 'Shoes' }];

test('buildCategoryLink encodes simple, spaced and ampersand names', () => {
    assert.equal(buildCategoryLink('Clothing'), '/products?category=Clothing');
    assert.equal(buildCategoryLink('Home & Garden'), '/products?category=Home%20%26%20Garden');
});

test('buildCategoryLink output round-trips through parseCategoryParams', () => {
    const url = new URL(buildCategoryLink('Home & Garden'), 'http://localhost');
    assert.deepEqual(parseCategoryParams(url.searchParams, categories), ['Home & Garden']);
});

test('parseCategoryParams reads a valid param, case-insensitively', () => {
    assert.deepEqual(parseCategoryParams(new URLSearchParams('category=clothing'), categories), ['Clothing']);
});

test('parseCategoryParams falls back to All (empty) for unknown or absent params', () => {
    assert.deepEqual(parseCategoryParams(new URLSearchParams('category=Nope'), categories), []);
    assert.deepEqual(parseCategoryParams(new URLSearchParams(''), categories), []);
    assert.deepEqual(parseCategoryParams(new URLSearchParams('category=Shoes'), []), []);
});

test('parseCategoryParams handles repeated params, dropping unknown and duplicates', () => {
    const params = new URLSearchParams('category=Shoes&category=Nope&category=shoes&category=Clothing');
    assert.deepEqual(parseCategoryParams(params, categories), ['Shoes', 'Clothing']);
});

test('serializeCategoryParams repeats the param and removes it for All', () => {
    assert.equal(serializeCategoryParams(['Shoes', 'Home & Garden']).toString(), 'category=Shoes&category=Home+%26+Garden');
    assert.equal(serializeCategoryParams([], new URLSearchParams('category=Shoes')).toString(), '');
});

test('serializeCategoryParams keeps unrelated params', () => {
    const result = serializeCategoryParams(['Shoes'], new URLSearchParams('x=1&category=Old'));
    assert.equal(result.toString(), 'x=1&category=Shoes');
});

test('buildProductQuery sends no category_name_in for All', () => {
    assert.equal(buildProductQuery({ names: [], limit: 10, offset: 0, ordering: '-created_at' }), 'limit=10&offset=0&ordering=-created_at');
});

test('buildProductQuery encodes names and joins them with a literal comma', () => {
    const query = buildProductQuery({ names: ['Home & Garden', 'Shoes'], limit: 10, offset: 20 });
    assert.equal(query, 'category_name_in=Home%20%26%20Garden,Shoes&limit=10&offset=20');
    assert.equal(new URLSearchParams(query).get('category_name_in'), 'Home & Garden,Shoes');
});

test('buildProductQuery encodes the search term', () => {
    const params = new URLSearchParams(buildProductQuery({ search: 'a&b=c, d' }));
    assert.equal(params.get('q'), 'a&b=c, d');
    assert.equal(params.get('b'), null);
});

test('buildProductQuery omits an empty search and has sane defaults', () => {
    assert.equal(buildProductQuery(), 'limit=10&offset=0');
});
