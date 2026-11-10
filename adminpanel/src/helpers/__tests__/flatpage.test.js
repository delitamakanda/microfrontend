import assert from 'node:assert/strict';
import test from 'node:test';
import {
    stripHtml,
    previewText,
    isContentEmpty,
    validateFlatPageUrl,
    urlToSlug,
    buildFlatPagePayload,
    extractApiError,
    isSuccess,
    findUrlConflict,
} from '../flatpage.js';

test('validateFlatPageUrl accepts a url starting and ending with a slash', () => {
    assert.equal(validateFlatPageUrl('/help/a/'), true);
    assert.equal(validateFlatPageUrl('/'), true);
});

test('validateFlatPageUrl rejects invalid urls', () => {
    assert.equal(validateFlatPageUrl(''), 'URL is required.');
    assert.notEqual(validateFlatPageUrl('help/a/'), true);
    assert.notEqual(validateFlatPageUrl('/help/a'), true);
    assert.notEqual(validateFlatPageUrl('/help /a/'), true);
    assert.notEqual(validateFlatPageUrl('/help//a/'), true);
    assert.notEqual(validateFlatPageUrl(undefined), true);
});

test('urlToSlug joins path segments with a dash', () => {
    assert.equal(urlToSlug('/help/shipping/'), 'help-shipping');
    assert.equal(urlToSlug(''), '');
});

test('stripHtml removes tags, scripts and decodes entities', () => {
    assert.equal(stripHtml('<p>Hello&nbsp;<strong>world</strong> &amp; co</p>'), 'Hello world & co');
    assert.equal(stripHtml('<p>a</p><script>alert(1)</script><p>b</p>'), 'a b');
    assert.equal(stripHtml(''), '');
    assert.equal(stripHtml(null), '');
});

test('previewText truncates long text', () => {
    assert.equal(previewText('<p>abcdefghij</p>', 5), 'abcde...');
    assert.equal(previewText('<p>short</p>', 50), 'short');
});

test('isContentEmpty detects empty editor output', () => {
    assert.equal(isContentEmpty('<p><br></p>'), true);
    assert.equal(isContentEmpty(''), true);
    assert.equal(isContentEmpty(null), true);
    assert.equal(isContentEmpty('<p>Hi</p>'), false);
});

test('buildFlatPagePayload defaults sites to [1] on creation', () => {
    const payload = buildFlatPagePayload({ title: ' T ', url: '/a/', content: '<p>x</p>' });
    assert.deepEqual(payload, {
        title: 'T',
        url: '/a/',
        content: '<p>x</p>',
        enable_comments: false,
        registration_required: false,
        template_name: '',
        sites: [1],
    });
});

test('buildFlatPagePayload preserves technical fields of an existing page', () => {
    const existing = { enable_comments: true, registration_required: true, template_name: 'x.html', sites: [2] };
    const payload = buildFlatPagePayload({ title: 'T', url: '/a/', content: 'c' }, existing);
    assert.equal(payload.enable_comments, true);
    assert.equal(payload.registration_required, true);
    assert.equal(payload.template_name, 'x.html');
    assert.deepEqual(payload.sites, [2]);
});

test('extractApiError reads DRF field errors', () => {
    const err = extractApiError({ status: 400, data: { url: ['Flatpage with this URL already exists.'] } });
    assert.deepEqual(err.fields, { url: 'Flatpage with this URL already exists.' });
    assert.equal(err.message, 'Flatpage with this URL already exists.');
});

test('extractApiError falls back on detail and generic message', () => {
    assert.equal(extractApiError({ status: 403, data: { detail: 'Forbidden' } }).message, 'Forbidden');
    assert.match(extractApiError(undefined).message, /Something went wrong/);
    assert.match(extractApiError({ status: 500, data: '<html>' }).message, /Something went wrong/);
});

test('findUrlConflict ignores the page being edited', () => {
    const results = [{ id: 1, url: '/a/' }, { id: 2, url: '/a/b/' }];
    assert.equal(findUrlConflict(results, '/a/', undefined), true);
    assert.equal(findUrlConflict(results, '/a/', '1'), false);
    assert.equal(findUrlConflict(results, '/zzz/', undefined), false);
    assert.equal(findUrlConflict(undefined, '/a/', undefined), false);
});

test('isSuccess only accepts 2xx responses', () => {
    assert.equal(isSuccess({ status: 201 }), true);
    assert.equal(isSuccess({ status: 500 }), false);
    assert.equal(isSuccess(undefined), false);
});
