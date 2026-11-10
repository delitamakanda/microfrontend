import assert from 'node:assert/strict';
import test from 'node:test';
import { createStore } from 'jotai';
import { parseStoredCart, serializeCart, readCart, writeCart } from '../cartStorage.js';
import { createCartAtom, cartItemsQuantityAtom } from '../../store.js';

const line = { product: { uuid: 'a', price: '10.5' }, quantity: 2, total: 21 };
const memoryStorage = (initial = {}) => {
    const data = Object.assign({}, initial);
    return {
        data,
        getItem: (k) => (k in data ? data[k] : null),
        setItem: (k, v) => { data[k] = v; },
        removeItem: (k) => { delete data[k]; },
    };
};
const throwing = {
    getItem() { throw new Error('denied'); },
    setItem() { throw new Error('quota'); },
};

test('parseStoredCart returns a valid cart unchanged', () => {
    assert.deepEqual(parseStoredCart(serializeCart([line])), [line]);
});

test('parseStoredCart falls back to [] on invalid input', () => {
    const invalid = [
        null, undefined, '', '{oops', '{"a":1}', '"x"', '[null]',
        JSON.stringify([{ product: {}, quantity: 1 }]),
        JSON.stringify([{ product: { uuid: 'a' }, quantity: '2' }]),
        JSON.stringify([line, { quantity: 1 }]),
    ];
    for (const raw of invalid) {
        assert.deepEqual(parseStoredCart(raw), []);
    }
});

test('readCart / writeCart tolerate a throwing or missing storage', () => {
    assert.deepEqual(readCart(throwing), []);
    assert.deepEqual(readCart(null), []);
    assert.doesNotThrow(() => writeCart(throwing, [line]));
    assert.doesNotThrow(() => writeCart(null, [line]));
});

test('cart atom persists and a new atom/store rehydrates it', () => {
    const storage = memoryStorage();
    const first = createCartAtom(() => storage);
    createStore().set(first, [line]);
    const second = createCartAtom(() => storage);
    assert.deepEqual(createStore().get(second), [line]);
});

test('cart atom starts empty on corrupted storage and overwrites it on change', () => {
    const storage = memoryStorage({ cart: '{bad' });
    const cart = createCartAtom(() => storage);
    const store = createStore();
    assert.deepEqual(store.get(cart), []);
    store.set(cart, (items) => [...items, line]);
    assert.deepEqual(JSON.parse(storage.data.cart), [line]);
});

test('cart atom keeps working in memory when storage throws', () => {
    const cart = createCartAtom(() => throwing);
    const store = createStore();
    store.set(cart, [line]);
    assert.deepEqual(store.get(cart), [line]);
});

test('cartItemsQuantityAtom is zero for the default empty cart', () => {
    assert.equal(createStore().get(cartItemsQuantityAtom), 0);
});
