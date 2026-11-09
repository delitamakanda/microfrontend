import assert from 'node:assert/strict';
import test from 'node:test';
import { ROUTES } from '../../../constants.js';
import {
    CART_LINK,
    MAIN_LINKS,
    getAccountLinks,
    getCartLabel,
    isLinkActive,
} from '../navLinks.js';

test('main links point to the shop routes', () => {
    assert.deepEqual(
        MAIN_LINKS.map((l) => [l.label, l.to]),
        [
            ['Home', ROUTES.HOME],
            ['Products', ROUTES.PRODUCTS],
            ['Categories', ROUTES.CATEGORIES],
        ],
    );
});

test('guests get Sign In and Register, no Orders', () => {
    const links = getAccountLinks(null);
    assert.deepEqual(
        links.map((l) => [l.label, l.to]),
        [
            ['Sign In', ROUTES.LOGIN],
            ['Register', ROUTES.SIGNUP],
        ],
    );
});

test('signed-in customers get Orders only', () => {
    const links = getAccountLinks('jwt');
    assert.deepEqual(
        links.map((l) => [l.label, l.to]),
        [['Orders', ROUTES.ORDER]],
    );
});

test('icons are unique across all links except the cart reuse', () => {
    const icons = [
        ...MAIN_LINKS,
        ...getAccountLinks(null),
        ...getAccountLinks('jwt'),
    ].map((l) => l.icon);
    assert.equal(new Set(icons).size, icons.length);
    assert.equal(CART_LINK.to, ROUTES.CART);
});

test('cart label handles 0, 1 and many items', () => {
    assert.equal(getCartLabel(0), 'Cart, 0 items');
    assert.equal(getCartLabel(1), 'Cart, 1 item');
    assert.equal(getCartLabel(3), 'Cart, 3 items');
    assert.equal(getCartLabel(undefined), 'Cart, 0 items');
    assert.equal(getCartLabel(NaN), 'Cart, 0 items');
});

test('isLinkActive matches the current pathname', () => {
    assert.equal(isLinkActive(ROUTES.HOME, '/'), true);
    assert.equal(isLinkActive(ROUTES.HOME, '/products'), false);
    assert.equal(isLinkActive(ROUTES.PRODUCTS, '/products'), true);
    assert.equal(isLinkActive(ROUTES.PRODUCTS, '/products/12'), true);
    assert.equal(isLinkActive(ROUTES.PRODUCTS, '/categories'), false);
    assert.equal(isLinkActive(ROUTES.CATEGORIES, '/categories'), true);
    assert.equal(isLinkActive(ROUTES.PRODUCTS, '/productsx'), false);
});
