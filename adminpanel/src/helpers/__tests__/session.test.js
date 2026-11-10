import assert from 'node:assert/strict';
import test from 'node:test';
import { isStaffUser, clearStoredSession, signOut, SESSION_KEYS } from '../session.js';

const createStorage = (entries = {}) => {
    const data = new Map(Object.entries(entries));
    return {
        data,
        removeItem: (key) => data.delete(key),
    };
};

test('isStaffUser accepts only users flagged as staff', () => {
    assert.equal(isStaffUser({ username: 'admin', is_staff: true }), true);
    assert.equal(isStaffUser({ username: 'customer', is_staff: false }), false);
    assert.equal(isStaffUser({ username: 'unknown' }), false);
    assert.equal(isStaffUser({ is_staff: 'true' }), false);
    assert.equal(isStaffUser(null), false);
    assert.equal(isStaffUser(undefined), false);
});

test('clearStoredSession removes the session keys only', () => {
    const storage = createStorage({ token: '"a"', refresh: '"b"', user: '{}', theme: '"dark"' });
    clearStoredSession(storage);
    for (const key of SESSION_KEYS) {
        assert.equal(storage.data.has(key), false);
    }
    assert.equal(storage.data.get('theme'), '"dark"');
});

test('clearStoredSession tolerates a missing or failing storage', () => {
    assert.doesNotThrow(() => clearStoredSession(undefined));
    assert.doesNotThrow(() => clearStoredSession({ removeItem: () => { throw new Error('denied'); } }));
});

test('signOut keeps the stored session when the API logout succeeds', async () => {
    const storage = createStorage({ token: '"a"' });
    const result = await signOut(async () => {}, storage);
    assert.equal(result, true);
    assert.equal(storage.data.has('token'), true);
});

test('signOut clears the stored session when the API logout fails', async () => {
    const storage = createStorage({ token: '"a"', refresh: '"b"', user: '{}' });
    const result = await signOut(async () => { throw new Error('Failed to logout'); }, storage);
    assert.equal(result, false);
    assert.equal(storage.data.size, 0);
});
