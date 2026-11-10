import assert from 'node:assert/strict';
import test from 'node:test';
import { createStore } from 'jotai';
import { cartAtom, cartItemsQuantityAtom } from '../../store.js';
import {
    addProductToCart,
    addToCart,
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

test('addProductToCart adds N units on a new line and recomputes the total', () => {
    assert.deepEqual(addProductToCart([], product, 3), [{ product, quantity: 3, total: 31.5 }]);
});

test('addProductToCart adds N units to an existing line', () => {
    const items = addProductToCart(addProductToCart([], product, 2), product, 3);
    assert.equal(items.length, 1);
    assert.equal(items[0].quantity, 5);
    assert.equal(items[0].total, 52.5);
});

test('addProductToCart caps the line at the stock', () => {
    const limited = { ...product, stock_quantity: 3 };
    const items = addProductToCart(addProductToCart([], limited, 2), limited, 5);
    assert.equal(items[0].quantity, 3);
    assert.equal(items[0].total, 31.5);
});

test('addProductToCart caps at 10 when stock is unknown or large', () => {
    assert.equal(addProductToCart([], product, 25)[0].quantity, 10);
    assert.equal(addProductToCart([], { ...product, stock_quantity: 50 }, 25)[0].quantity, 10);
});

test('addProductToCart ignores invalid quantities', () => {
    for (const q of [0, -2, NaN, 1.5, 'abc', {}]) {
        assert.deepEqual(addProductToCart([], product, q), []);
    }
    const items = addProductToCart([], product, 2);
    assert.equal(addProductToCart(items, product, 0), items);
});

test('addToCart reports added units and whether the cap was hit', () => {
    const limited = { ...product, stock_quantity: 3 };
    let res = addToCart([], limited, 2);
    assert.deepEqual([res.added, res.capped], [2, false]);
    res = addToCart(res.items, limited, 2);
    assert.deepEqual([res.added, res.capped], [1, true]);
    assert.equal(res.items[0].quantity, 3);
    res = addToCart(res.items, limited, 1);
    assert.deepEqual([res.added, res.capped], [0, true]);
    assert.equal(res.items[0].quantity, 3);
    res = addToCart([], product, 0);
    assert.deepEqual([res.added, res.capped], [0, false]);
});

test('addProductToCart does not mutate its input when capping', () => {
    const items = addProductToCart([], product, 9);
    const snapshot = JSON.parse(JSON.stringify(items));
    addProductToCart(items, product, 5);
    assert.deepEqual(items, snapshot);
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
