import test from 'node:test';
import assert from 'node:assert/strict';
import {
    validateUsername,
    validateEmail,
    validatePassword,
    validatePasswordConfirm,
    parseRegisterError,
    NETWORK_ERROR_MESSAGE,
    GENERIC_ERROR_MESSAGE,
} from '../registerValidation.js';

test('validateUsername: required, min 3 characters', () => {
    assert.equal(validateUsername(''), 'Username is required.');
    assert.equal(validateUsername('   '), 'Username is required.');
    assert.equal(validateUsername(undefined), 'Username is required.');
    assert.match(validateUsername('ab'), /at least 3/);
    assert.equal(validateUsername('abc'), true);
});

test('validateEmail: required, format, max 255', () => {
    assert.equal(validateEmail(''), 'Email is required.');
    assert.equal(validateEmail('nope'), 'Please enter a valid email address.');
    assert.equal(validateEmail('a@b'), 'Please enter a valid email address.');
    assert.equal(validateEmail('a@b.com'), true);
    const email = (n) => 'a'.repeat(n - 6) + '@b.com';
    assert.equal(validateEmail(email(255)), true);
    assert.equal(validateEmail(email(256)), 'Email cannot exceed 255 characters.');
});

test('validatePassword: required, min 8 characters', () => {
    assert.equal(validatePassword(''), 'Password is required.');
    assert.match(validatePassword('1234567'), /at least 8/);
    assert.equal(validatePassword('12345678'), true);
});

test('validatePasswordConfirm: required and must match', () => {
    assert.equal(validatePasswordConfirm('', 'secret123'), 'Please confirm your password.');
    assert.equal(validatePasswordConfirm('secret124', 'secret123'), 'Passwords do not match.');
    assert.equal(validatePasswordConfirm('secret123', 'secret123'), true);
});

test('parseRegisterError maps DRF field errors to form fields', () => {
    const error = {
        response: {
            status: 400,
            data: {
                email: ['A user is already registered with this e-mail address.'],
                password1: ['This password is too common.', 'This password is entirely numeric.'],
                password2: ['The two password fields did not match.'],
                username: ['A user with that username already exists.'],
                non_field_errors: ['Something is off.'],
            },
        },
    };
    const { fieldErrors, generalError } = parseRegisterError(error);
    assert.deepEqual(fieldErrors, {
        email: 'A user is already registered with this e-mail address.',
        password: 'This password is too common. This password is entirely numeric.',
        passwordConfirm: 'The two password fields did not match.',
        username: 'A user with that username already exists.',
    });
    assert.equal(generalError, 'Something is off.');
});

test('parseRegisterError: network error without response', () => {
    assert.deepEqual(parseRegisterError(new Error('timeout')), {
        fieldErrors: {},
        generalError: NETWORK_ERROR_MESSAGE,
    });
    assert.equal(parseRegisterError(undefined).generalError, NETWORK_ERROR_MESSAGE);
});

test('parseRegisterError: unusable body falls back to a generic message', () => {
    for (const data of [undefined, '<html>', {}, []]) {
        const r = parseRegisterError({ response: { status: 500, data } });
        assert.deepEqual(r.fieldErrors, {});
        assert.equal(r.generalError, GENERIC_ERROR_MESSAGE);
    }
});
