import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveRemoteUrl, DEV_REMOTE_URL, DEFAULT_PROD_REMOTE_URL } from '../remote.js';

test('dev mode always uses the local remote', () => {
    assert.equal(resolveRemoteUrl('development', 'https://x.example'), DEV_REMOTE_URL);
});

test('production falls back to the default remote', () => {
    assert.equal(resolveRemoteUrl('production'), DEFAULT_PROD_REMOTE_URL);
    assert.equal(resolveRemoteUrl('production', '  '), DEFAULT_PROD_REMOTE_URL);
});

test('production override accepts an origin, with or without trailing slash', () => {
    assert.equal(resolveRemoteUrl('production', 'https://shop.example/'), 'https://shop.example/assets/storefrontEntry.js');
    assert.equal(resolveRemoteUrl('production', 'https://shop.example'), 'https://shop.example/assets/storefrontEntry.js');
});

test('production override accepts a full entry URL', () => {
    const url = 'https://shop.example/assets/other.js';
    assert.equal(resolveRemoteUrl('production', url), url);
});
