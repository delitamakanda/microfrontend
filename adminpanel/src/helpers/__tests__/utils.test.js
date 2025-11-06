import assert from 'node:assert/strict';
import test from 'node:test';
import { separateAmount, formatDate } from '../utils.js';

test('separateAmount adds a separator every three digits', () => {
    assert.equal(separateAmount('1234567', ' '), '1 234 567');
});

test('separateAmount removes leading zeroes before formatting', () => {
    assert.equal(separateAmount('0000456', ','), '456');
});

test('separateAmount keeps decimal values intact', () => {
    assert.equal(separateAmount('12345.67'), '12 345.67');
});

test('separateAmount preserves negative amounts', () => {
    assert.equal(separateAmount('-9876543', '.'), '-9.876.543');
});

test('formatDate returns a yyyy-mm-dd formatted string', () => {
    assert.equal(formatDate('2023-11-05T00:00:00.000Z'), '2023-11-05');
});

test('formatDate pads month and day values', () => {
    const date = new Date(2024, 0, 9);
    assert.equal(formatDate(date), '2024-01-09');
});
