import assert from 'node:assert/strict';
import test from 'node:test';
import { createStore } from 'jotai';
import { getAvailability, addProductToCart } from '../product.js';
import { cartAtom, cartItemsQuantityAtom } from '../../store.js';

test('getAvailability: out of stock', () => {
    assert.deepEqual(getAvailability({ stock_quantity: 0 }), { label: 'OUT OF STOCK', severity: 'danger', canBuy: false });
});

test('getAvailability: low stock for 1 and 9', () => {
    for (const q of [1, 9]) {
        const a = getAvailability({ stock_quantity: q });
        assert.equal(a.label, 'LOW STOCK');
        assert.equal(a.canBuy, true);
    }
});

test('getAvailability: in stock from 10', () => {
    const a = getAvailability({ stock_quantity: 10 });
    assert.equal(a.label, 'IN STOCK');
    assert.equal(a.canBuy, true);
});

test('getAvailability: missing or negative is not purchasable, stock wins over status', () => {
    assert.equal(getAvailability({}).canBuy, false);
    assert.equal(getAvailability(null).canBuy, false);
    assert.equal(getAvailability({ stock_quantity: -3 }).canBuy, false);
    assert.equal(getAvailability({ status: '', stock_quantity: 25 }).label, 'IN STOCK');
    assert.equal(getAvailability({ status: 'IN STOCK', stock_quantity: 0 }).label, 'OUT OF STOCK');
});

test('addProductToCart: empty cart, string price', () => {
    const p = { uuid: 'a', price: '19.99' };
    assert.deepEqual(addProductToCart([], p), [{ product: p, quantity: 1, total: 19.99 }]);
});

test('addProductToCart: same uuid increments a single line', () => {
    const p = { uuid: 'a', price: '10.00' };
    const cart = addProductToCart(addProductToCart([], p), p);
    assert.equal(cart.length, 1);
    assert.equal(cart[0].quantity, 2);
    assert.equal(cart[0].total, 20);
});

test('addProductToCart: different product adds a line, input not mutated', () => {
    const a = { uuid: 'a', price: '1' };
    const b = { uuid: 'b', price: '2' };
    const first = addProductToCart([], a);
    const snapshot = JSON.parse(JSON.stringify(first));
    const second = addProductToCart(first, b);
    assert.equal(second.length, 2);
    assert.deepEqual(first, snapshot);
    const third = addProductToCart(second, a);
    assert.equal(second[0].quantity, 1);
    assert.equal(third[0].quantity, 2);
});

test('cartItemsQuantityAtom reflects additions', () => {
    const store = createStore();
    const p = { uuid: 'a', price: '5' };
    store.set(cartAtom, addProductToCart(store.get(cartAtom), p));
    store.set(cartAtom, addProductToCart(store.get(cartAtom), p));
    assert.equal(store.get(cartItemsQuantityAtom), 2);
});
