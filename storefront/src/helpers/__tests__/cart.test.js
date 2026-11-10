import assert from 'node:assert/strict';
import test from 'node:test';
import { createStore } from 'jotai';
import { cartAtom, cartItemsQuantityAtom } from '../../store.js';
import { addProductToCart } from '../cart.js';

const product = { uuid: 'a', name: 'Demo A', price: '10.50' };
const other = { uuid: 'b', name: 'Demo B', price: '4.00' };

test('addProductToCart adds a new line', () => {
    const items = addProductToCart([], product);
    assert.deepEqual(items, [{ product, quantity: 1, total: 10.5 }]);
});

test('addProductToCart increments quantity and total of an existing line', () => {
    const items = addProductToCart(addProductToCart([], product), product);
    assert.equal(items.length, 1);
    assert.equal(items[0].quantity, 2);
    assert.equal(items[0].total, 21);
});

test('addProductToCart works with the Jotai cart and does not mutate', () => {
    const store = createStore();
    store.set(cartAtom, (items) => addProductToCart(items, product));
    const before = store.get(cartAtom);
    store.set(cartAtom, (items) => addProductToCart(items, other));
    store.set(cartAtom, (items) => addProductToCart(items, product));
    assert.equal(before.length, 1);
    assert.equal(before[0].quantity, 1);
    assert.equal(store.get(cartAtom).length, 2);
    assert.equal(store.get(cartItemsQuantityAtom), 3);
});
