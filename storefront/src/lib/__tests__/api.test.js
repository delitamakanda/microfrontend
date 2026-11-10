import test, { beforeEach } from 'node:test';
import assert from 'node:assert/strict';

const data = {};
globalThis.window = {
    localStorage: {
        getItem: (k) => (k in data ? data[k] : null),
        setItem: (k, v) => { data[k] = v; },
    },
};

const { default: api } = await import('../api.js');

let calls;
const reply = (config, status, body = {}) => {
    const res = { data: body, status, statusText: '', headers: {}, config };
    if (status >= 200 && status < 300) return Promise.resolve(res);
    const err = new Error(`status ${status}`);
    err.isAxiosError = true;
    err.config = config;
    err.response = res;
    return Promise.reject(err);
};
const use = (handler) => {
    api.defaults.adapter = (config) => {
        calls.push({ url: config.url, auth: config.headers.Authorization });
        return handler(config);
    };
};

beforeEach(() => {
    calls = [];
    data.token = JSON.stringify('old');
    data.refresh = JSON.stringify('r1');
});

test('500 rejects with error.response.status', async () => {
    use((c) => reply(c, 500));
    await assert.rejects(api.get('store/dailyRevenue/'), (e) => e.response.status === 500);
    assert.equal(calls.length, 1);
});

test('network error rejects without response', async () => {
    use((c) => { const e = new Error('Network Error'); e.config = c; return Promise.reject(e); });
    await assert.rejects(api.get('store/product/'), (e) => e.response === undefined && e.message === 'Network Error');
});

test('401 refreshes once, stores the new token and replays the request', async () => {
    use((c) => {
        if (c.url === 'auth/token/refresh/') return reply(c, 200, { access: 'new' });
        return c.headers.Authorization === 'Bearer new' ? reply(c, 200, { ok: 1 }) : reply(c, 401);
    });
    const res = await api.get('store/coupon/');
    assert.deepEqual(res.data, { ok: 1 });
    assert.equal(JSON.parse(data.token), 'new');
    assert.deepEqual(calls.map((c) => c.url), ['store/coupon/', 'auth/token/refresh/', 'store/coupon/']);
});

test('401 with an invalid refresh rejects without recursion', async () => {
    use((c) => reply(c, 401));
    await assert.rejects(api.get('store/coupon/'), (e) => e.response.status === 401);
    assert.deepEqual(calls.map((c) => c.url), ['store/coupon/', 'auth/token/refresh/']);
});

test('401 on login never refreshes', async () => {
    use((c) => reply(c, 401));
    await assert.rejects(api.post('/auth/login/', {}), (e) => e.response.status === 401);
    assert.equal(calls.length, 1);
});

test('401 persisting after a replay rejects (no loop)', async () => {
    use((c) => (c.url === 'auth/token/refresh/' ? reply(c, 200, { access: 'new' }) : reply(c, 401)));
    await assert.rejects(api.get('store/coupon/'), (e) => e.response.status === 401);
    assert.equal(calls.filter((c) => c.url === 'auth/token/refresh/').length, 1);
});
