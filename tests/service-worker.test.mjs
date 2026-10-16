import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const origin = 'https://oleksandrkiris.github.io';
const base = `${origin}/citronex-dragon-guide/`;

function worker({ network = new Response('fresh'), cached, failPut = false, failAdd = false } = {}) {
  const handlers = {};
  const calls = { match: [], fetch: [], put: [], add: [], deleted: [], open: [], skip: 0, claim: 0 };
  const cache = {
    put: async (...args) => { calls.put.push(args); if (failPut) throw new Error('write failed'); },
    add: async request => { calls.add.push(request); if (failAdd) throw new Error('optional missing'); },
  };
  const self = {
    location: { origin },
    addEventListener: (name, handler) => { handlers[name] = handler; },
    skipWaiting: async () => { calls.skip++; },
    clients: { claim: async () => { calls.claim++; } },
  };
  vm.runInNewContext(source, {
    self, Response,
    Request: class extends Request { constructor(url, opts) { super(new URL(url, base), opts); } },
    URL,
    caches: {
      open: async name => { calls.open.push(name); return cache; },
      match: async (...args) => { calls.match.push(args); return cached; },
      keys: async () => ['citronex-dragon-guide-older', 'citronex-dragon-guide-20261016-primserv-guide1', 'citronex-dragon-guide-20261016-primserv-guide2', 'citronex-dragon-guide-20261016-primserv-guide3', 'unrelated-cache'],
      delete: async key => { calls.deleted.push(key); },
    },
    fetch: async request => {
      calls.fetch.push(request);
      if (network instanceof Error) throw network;
      return network;
    },
  });
  return {
    calls,
    fetch(path = 'assets/guide.js?v=current', options) {
      const request = new Request(new URL(path, base), options);
      let response;
      handlers.fetch({ request, respondWith: promise => { response = promise; } });
      return { request, response };
    },
    lifecycle(name) {
      let completion;
      handlers[name]({ waitUntil: promise => { completion = promise; } });
      return completion;
    },
  };
}

for (const path of ['index.html?lang=ua', 'assets/guide.js?v=current', 'assets/guide.css?v=current', 'assets/audio/intro-pl.mp3?v=voice6']) {
  test(`successful network request has no fallback cache lookup: ${path}`, async () => {
    const w = worker({ cached: new Response('older') });
    const { request, response } = w.fetch(path);
    assert.equal(await (await response).text(), 'fresh');
    assert.equal(w.calls.fetch.length, 1);
    assert.equal(w.calls.fetch[0], request);
    assert.equal(w.calls.match.length, 0);
    assert.equal(w.calls.put.length, 1);
    assert.equal(w.calls.put[0][0], request);
    assert.equal(await w.calls.put[0][1].text(), 'fresh');
  });
}

test('offline fallback still matches the original request ignoring version query', async () => {
  const w = worker({ network: new Error('offline'), cached: new Response('offline copy') });
  const { request, response } = w.fetch('assets/guide.js?v=newer');
  assert.equal(await (await response).text(), 'offline copy');
  assert.equal(w.calls.match.length, 1);
  assert.equal(w.calls.match[0][0], request);
  assert.equal(w.calls.match[0][1].ignoreSearch, true);
  assert.equal(w.calls.put.length, 0);
});

test('missing offline resource returns a network error response', async () => {
  const w = worker({ network: new Error('offline') });
  const response = await w.fetch().response;
  assert.equal(response.type, 'error');
  assert.equal(response.status, 0);
  assert.equal(w.calls.match.length, 1);
});

for (const status of [404, 500]) {
  test(`HTTP ${status} remains a network response, not a stale offline response`, async () => {
    const w = worker({ network: new Response('upstream error', { status }), cached: new Response('stale') });
    assert.equal((await w.fetch().response).status, status);
    assert.equal(w.calls.match.length, 0);
    assert.equal(w.calls.put.length, 0);
  });
}

test('cache write failure keeps the existing fallback policy', async () => {
  const w = worker({ failPut: true, cached: new Response('fallback') });
  assert.equal(await (await w.fetch().response).text(), 'fallback');
  assert.equal(w.calls.put.length, 1);
  assert.equal(w.calls.match.length, 1);
});

test('cross-origin and non-GET requests are not intercepted', () => {
  const w = worker();
  assert.equal(w.fetch('https://www.primserv.pl/').response, undefined);
  assert.equal(w.fetch('index.html', { method: 'POST', body: 'not sent' }).response, undefined);
  assert.equal(w.calls.fetch.length, 0);
  assert.equal(w.calls.match.length, 0);
});

test('install caches seven core resources including both official assets, without preloading audio', async () => {
  const w = worker();
  await w.lifecycle('install');
  assert.equal(w.calls.add.length, 7);
  assert.ok(w.calls.add.some(request => request.url.endsWith('/assets/brand/primserv-logo.svg')));
  assert.ok(w.calls.add.some(request => request.url.endsWith('/assets/brand/primserv-icon-192.png')));
  assert.ok(w.calls.add.every(request => !request.url.includes('/audio/')));
  assert.ok(w.calls.add.every(request => request.cache === 'reload'));
  assert.equal(w.calls.skip, 1);
  assert.equal(w.calls.match.length, 0);
});

test('missing optional core resources cannot prevent installation', async () => {
  const w = worker({ failAdd: true });
  await w.lifecycle('install');
  assert.equal(w.calls.add.length, 7);
  assert.equal(w.calls.skip, 1);
});

test('activation removes only older caches in this guide namespace', async () => {
  const w = worker();
  await w.lifecycle('activate');
  assert.deepEqual(w.calls.deleted, ['citronex-dragon-guide-older', 'citronex-dragon-guide-20261016-primserv-guide1', 'citronex-dragon-guide-20261016-primserv-guide2']);
  assert.equal(w.calls.claim, 1);
});
