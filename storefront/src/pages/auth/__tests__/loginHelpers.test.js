import test from 'node:test';
import assert from 'node:assert/strict';
import {
    getLoginErrorMessage,
    getRedirectTarget,
    INVALID_CREDENTIALS_MESSAGE,
    GENERIC_LOGIN_ERROR_MESSAGE,
} from '../loginHelpers.js';

test('getLoginErrorMessage: 400 means invalid credentials', () => {
    const axiosError = { response: { status: 400 } };
    assert.equal(getLoginErrorMessage(axiosError), INVALID_CREDENTIALS_MESSAGE);
    assert.equal(
        getLoginErrorMessage(new Error('Failed to login', { cause: axiosError })),
        INVALID_CREDENTIALS_MESSAGE
    );
});

test('getLoginErrorMessage: network, timeout and 5xx give the generic message', () => {
    assert.equal(getLoginErrorMessage(new Error('Network Error')), GENERIC_LOGIN_ERROR_MESSAGE);
    assert.equal(
        getLoginErrorMessage(new Error('Failed to login', { cause: { code: 'ECONNABORTED' } })),
        GENERIC_LOGIN_ERROR_MESSAGE
    );
    assert.equal(
        getLoginErrorMessage({ cause: { response: { status: 500 } } }),
        GENERIC_LOGIN_ERROR_MESSAGE
    );
});

test('getLoginErrorMessage: does not throw on undefined or null', () => {
    assert.equal(getLoginErrorMessage(undefined), GENERIC_LOGIN_ERROR_MESSAGE);
    assert.equal(getLoginErrorMessage(null), GENERIC_LOGIN_ERROR_MESSAGE);
});

test('getRedirectTarget: keeps a valid internal path with search and hash', () => {
    assert.equal(
        getRedirectTarget({ from: { pathname: '/checkout', search: '?a=1', hash: '#x' } }, '/order'),
        '/checkout?a=1#x'
    );
    assert.equal(getRedirectTarget({ from: { pathname: '/checkout' } }, '/order'), '/checkout');
});

test('getRedirectTarget: falls back when absent or malformed', () => {
    assert.equal(getRedirectTarget(undefined, '/order'), '/order');
    assert.equal(getRedirectTarget(null, '/order'), '/order');
    assert.equal(getRedirectTarget({}, '/order'), '/order');
    assert.equal(getRedirectTarget({ from: { pathname: 42 } }, '/order'), '/order');
    assert.equal(getRedirectTarget({ from: 42 }, '/order'), '/order');
});

test('getRedirectTarget: refuses external targets', () => {
    assert.equal(getRedirectTarget({ from: { pathname: '//evil.com' } }, '/order'), '/order');
    assert.equal(getRedirectTarget({ from: { pathname: 'http://evil.com' } }, '/order'), '/order');
    assert.equal(getRedirectTarget({ from: { pathname: '/\\evil.com' } }, '/order'), '/order');
    assert.equal(getRedirectTarget({ from: 'https://evil.com' }, '/order'), '/order');
});

test('getRedirectTarget: refuses auth pages to avoid loops', () => {
    assert.equal(getRedirectTarget({ from: { pathname: '/login' } }, '/order'), '/order');
    assert.equal(getRedirectTarget({ from: { pathname: '/signup' } }, '/order'), '/order');
});
