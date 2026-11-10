import test from 'node:test';
import assert from 'node:assert/strict';
import { NOT_FOUND_LINKS } from '../notFoundLinks.js';
import { ROUTES } from '../../../constants.js';

test('404 links target home and products', () => {
    assert.deepEqual(NOT_FOUND_LINKS.map((l) => l.to), [ROUTES.HOME, ROUTES.PRODUCTS]);
    assert.deepEqual(NOT_FOUND_LINKS.map((l) => l.label), ['Back to home', 'Browse products']);
});
