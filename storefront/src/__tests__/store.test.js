import assert from 'node:assert/strict';
import test from 'node:test';
import { createStore } from 'jotai';
import { cartAtom, cartItemsQuantityAtom } from '../store.js';

test('cartItemsQuantityAtom aggregates the total number of items', () => {
    const store = createStore();
    store.set(cartAtom, [
        { id: 1, quantity: '2' },
        { id: 2, quantity: '3' },
        { id: 3, quantity: 1 },
    ]);

    assert.equal(store.get(cartItemsQuantityAtom), 6);
});

test('cartItemsQuantityAtom returns zero for an empty cart', () => {
    const store = createStore();
    store.set(cartAtom, []);

    assert.equal(store.get(cartItemsQuantityAtom), 0);
});
