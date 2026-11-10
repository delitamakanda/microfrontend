import assert from 'node:assert/strict';
import test from 'node:test';
import { createStore } from 'jotai';
import {
    WISHLIST_STORAGE_KEY,
    parseStoredWishlist,
    readWishlist,
    serializeWishlist,
    writeWishlist,
} from '../wishlistStorage.js';
import { createWishlistAtom, wishlistAtom, wishlistCountAtom } from '../../store.js';

const entry = { uuid: 'a', name: 'Demo A', price: '10.5', image_url: null, stock_quantity: 3 };
const memoryStorage = (initial = {}) => {
    const data = Object.assign({}, initial);
    return {
        data,
        getItem: (k) => (k in data ? data[k] : null),
        setItem: (k, v) => { data[k] = v; },
    };
};
const throwing = {
    getItem() { throw new Error('denied'); },
    setItem() { throw new Error('quota'); },
};

test('parseStoredWishlist returns a valid list unchanged', () => {
    assert.deepEqual(parseStoredWishlist(serializeWishlist([entry])), [entry]);
});

test('parseStoredWishlist falls back to [] on invalid input', () => {
    const invalid = [
        null, undefined, '', '{oops', '{"a":1}', '"x"', '[null]', '[1]',
        JSON.stringify([{ name: 'no uuid' }]),
        JSON.stringify([{ uuid: 12 }]),
        JSON.stringify([entry, { uuid: '' }]),
    ];
    for (const raw of invalid) assert.deepEqual(parseStoredWishlist(raw), []);
});

test('readWishlist / writeWishlist tolerate a throwing or missing storage', () => {
    assert.deepEqual(readWishlist(throwing), []);
    assert.deepEqual(readWishlist(null), []);
    assert.doesNotThrow(() => writeWishlist(throwing, [entry]));
    assert.doesNotThrow(() => writeWishlist(null, [entry]));
});

test('writeWishlist then readWishlist round-trips under the wishlist key', () => {
    const storage = memoryStorage();
    writeWishlist(storage, [entry]);
    assert.ok(WISHLIST_STORAGE_KEY in storage.data);
    assert.deepEqual(readWishlist(storage), [entry]);
    assert.equal(serializeWishlist('nope'), '[]');
});

test('wishlistAtom persists to storage and wishlistCountAtom counts', () => {
    const storage = memoryStorage();
    const atom = createWishlistAtom(() => storage);
    const store = createStore();
    store.set(atom, (items) => [...items, entry]);
    assert.deepEqual(readWishlist(storage), [entry]);
    assert.deepEqual(store.get(atom), [entry]);

    const restored = createWishlistAtom(() => storage);
    assert.deepEqual(createStore().get(restored), [entry]);

    const shared = createStore();
    shared.set(wishlistAtom, [entry, { ...entry, uuid: 'b' }]);
    assert.equal(shared.get(wishlistCountAtom), 2);
});

test('createWishlistAtom starts empty with a throwing storage', () => {
    const atom = createWishlistAtom(() => throwing);
    const store = createStore();
    assert.deepEqual(store.get(atom), []);
    assert.doesNotThrow(() => store.set(atom, [entry]));
    assert.deepEqual(store.get(atom), [entry]);
});
