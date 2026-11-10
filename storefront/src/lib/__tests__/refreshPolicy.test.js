import test from 'node:test';
import assert from 'node:assert/strict';
import { isAuthUrl, shouldRefresh } from '../refreshPolicy.js';

test('isAuthUrl matches login and refresh with or without leading slash', () => {
    for (const u of ['auth/login/', '/auth/login/', 'auth/token/refresh/', '/auth/token/refresh/',
        'http://localhost:8000/api/auth/login/', 'auth/login/?next=1']) {
        assert.equal(isAuthUrl(u), true, u);
    }
    for (const u of ['store/product/', 'registration/', 'xauth/login/', undefined, null]) {
        assert.equal(isAuthUrl(u), false, String(u));
    }
});

test('shouldRefresh: 401 on a regular first attempt', () => {
    assert.equal(shouldRefresh({ status: 401, url: 'store/coupon/', retried: undefined }), true);
});

test('shouldRefresh: never for login/refresh, retried, other statuses or no response', () => {
    assert.equal(shouldRefresh({ status: 401, url: '/auth/login/' }), false);
    assert.equal(shouldRefresh({ status: 401, url: 'auth/token/refresh/' }), false);
    assert.equal(shouldRefresh({ status: 401, url: 'store/coupon/', retried: true }), false);
    assert.equal(shouldRefresh({ status: 500, url: 'store/coupon/' }), false);
    assert.equal(shouldRefresh({ status: undefined, url: 'store/coupon/' }), false);
    assert.equal(shouldRefresh(), false);
});
