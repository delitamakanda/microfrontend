import assert from 'node:assert/strict';
import test from 'node:test';
import {
    getLoginErrorMessage,
    getRedirectTarget,
    INVALID_CREDENTIALS_MESSAGE,
    UNREACHABLE_MESSAGE,
} from '../loginErrors.js';

const withStatus = (status) => ({ response: { status } });
const wrapped = (cause) => new Error('Failed to login', { cause });

test('400 and 401 mean invalid credentials', () => {
    assert.equal(getLoginErrorMessage(wrapped(withStatus(401))), INVALID_CREDENTIALS_MESSAGE);
    assert.equal(getLoginErrorMessage(wrapped(withStatus(400))), INVALID_CREDENTIALS_MESSAGE);
    assert.equal(getLoginErrorMessage(withStatus(401)), INVALID_CREDENTIALS_MESSAGE);
});

test('network errors, timeouts and 5xx mean server unreachable', () => {
    assert.equal(getLoginErrorMessage(wrapped({ code: 'ERR_NETWORK' })), UNREACHABLE_MESSAGE);
    assert.equal(getLoginErrorMessage(wrapped({ code: 'ECONNABORTED' })), UNREACHABLE_MESSAGE);
    assert.equal(getLoginErrorMessage(wrapped(withStatus(500))), UNREACHABLE_MESSAGE);
    assert.equal(getLoginErrorMessage(wrapped(withStatus(503))), UNREACHABLE_MESSAGE);
    assert.equal(getLoginErrorMessage(new Error('Failed to login')), UNREACHABLE_MESSAGE);
    assert.equal(getLoginErrorMessage(undefined), UNREACHABLE_MESSAGE);
});

test('getRedirectTarget returns the route the user came from', () => {
    assert.equal(getRedirectTarget({ state: { from: { pathname: '/products' } } }), '/products');
    assert.equal(
        getRedirectTarget({ state: { from: { pathname: '/products', search: '?page=2', hash: '#a' } } }),
        '/products?page=2#a'
    );
    assert.equal(getRedirectTarget({ state: { from: '/coupons' } }), '/coupons');
});

test('getRedirectTarget falls back to / when missing or unsafe', () => {
    assert.equal(getRedirectTarget(undefined), '/');
    assert.equal(getRedirectTarget({}), '/');
    assert.equal(getRedirectTarget({ state: {} }), '/');
    assert.equal(getRedirectTarget({ state: { from: { pathname: 'https://evil.example' } } }), '/');
    assert.equal(getRedirectTarget({ state: { from: { pathname: '//evil.example' } } }), '/');
    assert.equal(getRedirectTarget({ state: { from: { pathname: '/\\evil.example' } } }), '/');
    assert.equal(getRedirectTarget({ state: { from: { pathname: '/login' } } }), '/');
    assert.equal(getRedirectTarget({ state: { from: 42 } }), '/');
});
