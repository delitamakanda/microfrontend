import assert from 'node:assert/strict';
import test from 'node:test';
import { parseViewParam, serializeViewParam } from '../viewMode.js';

test('parseViewParam defaults to grid and ignores unknown values', () => {
    assert.equal(parseViewParam(new URLSearchParams('')), 'grid');
    assert.equal(parseViewParam(new URLSearchParams('view=list')), 'list');
    assert.equal(parseViewParam(new URLSearchParams('view=xyz')), 'grid');
    assert.equal(parseViewParam(new URLSearchParams('view=grid')), 'grid');
    assert.equal(parseViewParam(undefined), 'grid');
});

test('serializeViewParam adds view=list and removes it for the grid', () => {
    assert.equal(serializeViewParam('list', new URLSearchParams('')).toString(), 'view=list');
    assert.equal(serializeViewParam('grid', new URLSearchParams('view=list')).toString(), '');
    assert.equal(serializeViewParam('xyz', new URLSearchParams('view=list')).toString(), '');
});

test('serializeViewParam keeps the other params, categories included', () => {
    const params = new URLSearchParams('category=Shoes&category=Clothing');
    const list = serializeViewParam('list', params);
    assert.deepEqual(list.getAll('category'), ['Shoes', 'Clothing']);
    assert.equal(list.get('view'), 'list');
    assert.equal(params.has('view'), false);
    assert.equal(serializeViewParam('grid', list).toString(), 'category=Shoes&category=Clothing');
});
