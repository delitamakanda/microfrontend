import assert from 'node:assert/strict';
import test from 'node:test';
import {
    addToWishlist,
    getWishlistLabel,
    isInWishlist,
    removeFromWishlist,
    toggleWishlist,
} from '../wishlist.js';

const a = { uuid: 'a', name: 'Demo A', price: '10.00', image_url: 'x.png', stock_quantity: 4, description: 'ignored' };
const b = { uuid: 'b', name: 'Demo B', price: '5.00', stock_quantity: 0 };

test('addToWishlist stores a snapshot of the product', () => {
    assert.deepEqual(addToWishlist([], a), [
        { uuid: 'a', name: 'Demo A', price: '10.00', image_url: 'x.png', stock_quantity: 4 },
    ]);
    assert.equal(addToWishlist([], b)[0].image_url, null);
});

test('addToWishlist ignores duplicates, null and uuid-less products', () => {
    const list = addToWishlist([], a);
    assert.equal(addToWishlist(list, a), list);
    assert.deepEqual(addToWishlist(list, null), list);
    assert.deepEqual(addToWishlist(list, undefined), list);
    assert.deepEqual(addToWishlist(list, { name: 'x' }), list);
    assert.deepEqual(addToWishlist(undefined, a).map((i) => i.uuid), ['a']);
});

test('removeFromWishlist removes only the matching entry without mutating', () => {
    const list = addToWishlist(addToWishlist([], a), b);
    const next = removeFromWishlist(list, 'a');
    assert.deepEqual(next.map((i) => i.uuid), ['b']);
    assert.equal(list.length, 2);
    assert.deepEqual(removeFromWishlist(null, 'a'), []);
});

test('toggleWishlist adds then removes', () => {
    const on = toggleWishlist([], a);
    assert.equal(isInWishlist(on, 'a'), true);
    const off = toggleWishlist(on, a);
    assert.equal(isInWishlist(off, 'a'), false);
    assert.deepEqual(toggleWishlist(on, null), on);
});

test('isInWishlist handles missing input', () => {
    assert.equal(isInWishlist(undefined, 'a'), false);
    assert.equal(isInWishlist([], undefined), false);
});

test('getWishlistLabel pluralises and tolerates bad counts', () => {
    assert.equal(getWishlistLabel(0), 'Wishlist, 0 items');
    assert.equal(getWishlistLabel(1), 'Wishlist, 1 item');
    assert.equal(getWishlistLabel(2), 'Wishlist, 2 items');
    assert.equal(getWishlistLabel(NaN), 'Wishlist, 0 items');
    assert.equal(getWishlistLabel(undefined), 'Wishlist, 0 items');
});
