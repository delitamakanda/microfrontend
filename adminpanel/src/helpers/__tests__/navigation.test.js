import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { NAV_ITEMS, isActiveRoute } from '../navigation.js';

test('root is active only on the exact route', () => {
    assert.equal(isActiveRoute('/', '/'), true);
    assert.equal(isActiveRoute('/products', '/'), false);
});

test('sub-routes activate their section', () => {
    assert.equal(isActiveRoute('/products', '/products'), true);
    assert.equal(isActiveRoute('/products/edit/1', '/products'), true);
    assert.equal(isActiveRoute('/products/edit/1', '/categories'), false);
});

test('a longer sibling path does not match', () => {
    assert.equal(isActiveRoute('/productsx', '/products'), false);
});

test('trailing slash, query and hash are ignored', () => {
    assert.equal(isActiveRoute('/products/', '/products'), true);
    assert.equal(isActiveRoute('/products?page=2', '/products'), true);
    assert.equal(isActiveRoute('/products#top', '/products'), true);
    assert.equal(isActiveRoute('/?x=1', '/'), true);
});

test('exactly one entry is active on each route', () => {
    for (const { to } of NAV_ITEMS) {
        const path = to === '/' ? '/' : `${to}/edit/3`;
        const active = NAV_ITEMS.filter((item) => isActiveRoute(path, item.to));
        assert.deepEqual(active.map((item) => item.to), [to]);
    }
});

test('entries match the top-level routes of App.jsx', () => {
    const app = readFileSync(new URL('../../App.jsx', import.meta.url), 'utf8');
    const routes = [...app.matchAll(/<Route (?:index )?path="(\/[^"]*)"/g)]
        .map((m) => m[1])
        .filter((p) => p !== '/login');
    assert.deepEqual(NAV_ITEMS.map((item) => item.to).sort(), [...new Set(routes)].sort());
    assert.equal(NAV_ITEMS.length, 7);
});
