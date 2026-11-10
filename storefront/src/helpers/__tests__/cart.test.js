import assert from 'node:assert/strict';
import test from 'node:test';
import { createStore } from 'jotai';
import { cartAtom, cartItemsQuantityAtom } from '../../store.js';
import {
    addProductToCart,
    getCartSubtotal,
    getMaxQuantity,
    removeCartItem,
    setCartItemQuantity,
} from '../cart.js';

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

test('setCartItemQuantity updates quantity and total without mutating', () => {
    const items = addProductToCart(addProductToCart([], product), other);
    const next = setCartItemQuantity(items, 'a', 3);
    assert.equal(next[0].quantity, 3);
    assert.equal(next[0].total, 31.5);
    assert.equal(next[1], items[1]);
    assert.equal(items[0].quantity, 1);
});

test('setCartItemQuantity ignores an unknown uuid', () => {
    const items = addProductToCart([], product);
    assert.deepEqual(setCartItemQuantity(items, 'zzz', 5), items);
});

test('removeCartItem removes only the matching line', () => {
    const items = addProductToCart(addProductToCart([], product), other);
    const next = removeCartItem(items, 'a');
    assert.deepEqual(next.map((i) => i.product.uuid), ['b']);
    assert.equal(items.length, 2);
    assert.deepEqual(removeCartItem(next, 'b'), []);
});

test('getCartSubtotal sums line totals', () => {
    assert.equal(getCartSubtotal([]), 0);
    assert.equal(getCartSubtotal(undefined), 0);
    const items = setCartItemQuantity(addProductToCart(addProductToCart([], product), other), 'b', 2);
    assert.equal(getCartSubtotal(items), 18.5);
    assert.equal(getCartSubtotal([{ product, quantity: 1, total: '10.50' }]), 10.5);
});

test('getMaxQuantity is 10, bounded by stock when known', () => {
    assert.equal(getMaxQuantity({}), 10);
    assert.equal(getMaxQuantity({ stock_quantity: 4 }), 4);
    assert.equal(getMaxQuantity({ stock_quantity: 50 }), 10);
    assert.equal(getMaxQuantity({ stock_quantity: 0 }), 10);
});

test('cart edits work with the Jotai cart and the navbar counter', () => {
    const store = createStore();
    store.set(cartAtom, (items) => addProductToCart(addProductToCart(items, product), other));
    store.set(cartAtom, (items) => setCartItemQuantity(items, 'a', 4));
    assert.equal(store.get(cartItemsQuantityAtom), 5);
    store.set(cartAtom, (items) => removeCartItem(items, 'a'));
    assert.equal(store.get(cartItemsQuantityAtom), 1);
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
