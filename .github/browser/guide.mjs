// User-authorized GitHub Actions acceptance; never launch a local substitute browser.
import assert from 'node:assert/strict';
import { headUpgradeReady } from './cache-upgrade-gate.mjs';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

assert.equal(process.env.GITHUB_ACTIONS, 'true', 'Only run in the authorized CI environment');
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_PACKAGE);
const reportDir = resolve(process.env.BROWSER_REPORT);
await mkdir(reportDir, { recursive: true });
const sha256 = data => createHash('sha256').update(data).digest('hex');
const git = (...args) => execFileSync('git', args);
const report = { head: process.env.TESTED_HEAD, base: process.env.TESTED_BASE,
  checkout: git('rev-parse', 'HEAD').toString().trim(), started: new Date().toISOString(),
  results: [], files: {}, requests: [], blocked: [], errors: [],
  limits: ['Desktop Chromium, 320px emulation is not a physical phone.',
    'Existing English MP3 is decoded; no new speech/audio is generated.',
    'OS speech voices and external training sites are not accepted by this test.',
    'External navigation uses a labelled destination fixture, never a real submission.',
    'Offline is browser network disabled after first successful local HTTP installation.'] };
const files = ['index.html', 'assets/guide.js', 'assets/guide.css', 'sw.js',
  'manifest.webmanifest', 'assets/brand/primserv-logo.svg', 'assets/brand/primserv-icon-192.png',
  'assets/audio/intro-en.mp3'];
const current = new Map(), previous = new Map();
for (const file of files) {
  const bytes = await readFile(file);
  assert.equal(sha256(bytes), sha256(git('show', `${report.head}:${file}`)), `Exact head: ${file}`);
  current.set(file, bytes);
  previous.set(file, git('show', `${report.base}:${file}`));
  report.files[file] = { bytes: bytes.length, sha256: sha256(bytes) };
}
const cacheName = bytes => {
  const match = bytes.toString().match(/const CACHE_NAME = CACHE_PREFIX \+ "([^"]+)"/);
  assert.ok(match, 'Versioned guide cache must be explicit');
  return 'citronex-dragon-guide-' + match[1];
};
const baseCache = cacheName(previous.get('sw.js'));
const headCache = cacheName(current.get('sw.js'));
assert.notEqual(baseCache, headCache, 'This acceptance requires a real SW upgrade');
let oldVersion = false;
const prefix = '/citronex-dragon-guide/';
const types = { html: 'text/html', js: 'application/javascript', css: 'text/css',
  svg: 'image/svg+xml', png: 'image/png', mp3: 'audio/mpeg', webmanifest: 'application/manifest+json' };
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  report.requests.push({ path: url.pathname, method: req.method, version: oldVersion ? 'base' : 'head' });
  if (!['GET', 'HEAD'].includes(req.method) || !url.pathname.startsWith(prefix)) {
    res.writeHead(404).end(); return;
  }
  const file = url.pathname.slice(prefix.length) || 'index.html';
  const bytes = (oldVersion ? previous : current).get(file);
  if (!bytes) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'Content-Type': types[file.split('.').at(-1)] || 'application/octet-stream',
    'Content-Length': bytes.length, 'Cache-Control': 'no-store' });
  res.end(req.method === 'HEAD' ? undefined : bytes);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}${prefix}`;
const port = server.address().port;
report.url = base;
// Chromium's offline emulation can leave a service-worker-owned fetch online.
// Also stop the actual HTTP origin: failed media/cache reads cannot reach it.
async function offline(ctx, value) {
  await ctx.setOffline(value);
  if (value && server.listening) {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  } else if (!value && !server.listening) {
    await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
  }
}
let browser, activePage;
const contexts = [];
async function context(width, storage = '') {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, locale: 'en-US' });
  contexts.push(ctx);
  ctx.setDefaultTimeout(12000);
  await ctx.tracing.start({ screenshots: true, snapshots: true });
  await ctx.route('**/*', route => {
    const req = route.request();
    if (!['GET', 'HEAD'].includes(req.method())) {
      report.blocked.push({ method: req.method(), url: req.url() }); return route.abort();
    }
    if (new URL(req.url()).origin !== new URL(base).origin) {
      report.blocked.push({ method: req.method(), url: req.url(), fixture: req.isNavigationRequest() });
      if (req.isNavigationRequest()) return route.fulfill({ contentType: 'text/html',
        body: '<title>Test destination only</title><p>External destination intercepted. Use browser Back.</p>' });
      return route.abort();
    }
    return route.continue();
  });
  if (storage === 'denied') await ctx.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Test storage denied', 'SecurityError'); } });
  });
  if (storage === 'corrupt') await ctx.addInitScript(() => {
    localStorage.setItem('cxDragonGuide:lang', '{broken');
    localStorage.setItem('cxDragonGuide:ryczywol:seen:20260717-location-copy', '{broken');
    localStorage.setItem('unrelated', 'keep');
  });
  const page = activePage = await ctx.newPage();
  page.on('pageerror', err => report.errors.push(err.message));
  return { ctx, page };
}
async function ready(page) { await page.locator('#guideApp').waitFor({ state: 'visible' }); }
async function controlled(page) {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
}
async function keyboard(page, id) {
  for (let n = 0; n < 35; n++) {
    if (await page.evaluate(() => document.activeElement?.id) === id) { await page.keyboard.press('Enter'); return; }
    await page.keyboard.press('Tab');
  }
  throw Error(`Cannot reach ${id} with Tab`);
}
async function shot(page, name) {
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Horizontal overflow');
  await page.screenshot({ path: join(reportDir, `${name}.png`), fullPage: true });
}
async function playing(page) {
  await page.waitForFunction(() => { const a = document.querySelector('audio'); return !a.paused && !a.error && a.currentTime > 0; });
}
async function failed(page) {
  await page.waitForFunction(() => Boolean(document.querySelector('audio').error));
  await page.locator('#openButton').waitFor({ state: 'visible' });
  assert.ok((await page.locator('#speechText').innerText()).length > 30);
}
try {
  browser = await chromium.launch({ headless: true });
  report.browser = `Chromium ${browser.version()} / Playwright 1.56.1`;
  for (const width of [1280, 320]) {
    const { ctx, page } = await context(width);
    await page.goto(`${base}?lang=en&welcome=1`); await ready(page); await controlled(page);
    assert.equal(await page.locator('audio').getAttribute('src'), null, 'No unsolicited media');
    await offline(ctx, true);
    assert.equal(await page.evaluate(() => navigator.onLine), false);
    await keyboard(page, 'startButton'); await failed(page);
    await shot(page, `offline-error-${width}`);
    // A second explicit attempt still fails safely; there is no automatic retry loop.
    await keyboard(page, 'startButton'); await failed(page);
    const before = report.requests.filter(r => r.path.endsWith('.mp3')).length;
    await page.waitForTimeout(800);
    assert.equal(report.requests.filter(r => r.path.endsWith('.mp3')).length, before);
    await offline(ctx, false);
    await keyboard(page, 'startButton'); await playing(page);
    await keyboard(page, 'pauseButton');
    assert.equal(await page.locator('#pauseButton').innerText(), 'Resume');
    assert.equal(await page.locator('audio').evaluate(a => a.paused), true);
    await keyboard(page, 'pauseButton'); await playing(page);
    await keyboard(page, 'replayButton'); await playing(page);
    assert.equal(await page.locator('#pauseButton').innerText(), 'Pause');
    await keyboard(page, 'pauseButton'); await shot(page, `recovered-${width}`);
    for (const lang of ['pl', 'en', 'ua', 'ru', 'az', 'es', 'fil', 'id', 'ne']) {
      await page.locator('#languageSelect').selectOption(lang);
      assert.equal(await page.locator('html').getAttribute('lang'), lang === 'ua' ? 'uk' : lang);
      assert.ok((await page.locator('#speechText').innerText()).length > 30);
      await shot(page, `language-${lang}-${width}`);
    }
    await page.locator('#languageSelect').selectOption('ua');
    await offline(ctx, true); await page.reload(); await ready(page);
    assert.equal(await page.locator('#languageSelect').inputValue(), 'ua');
    assert.equal(await page.evaluate(() => navigator.onLine), false);
    await shot(page, `offline-reload-${width}`);
    await offline(ctx, false);
    await page.goto(`${base}?lang=ka&welcome=1`); await ready(page);
    assert.equal(await page.locator('#languageSelect').inputValue(), 'ka');
    assert.equal(await page.locator('#audioLanguageNotice').isVisible(), true);
    await shot(page, `fallback-${width}`);
    await keyboard(page, 'skipButton'); await page.waitForURL(/citronex-hydra-project/);
    await page.goBack(); await ready(page);
    assert.equal(await page.locator('#languageSelect').inputValue(), 'ka');
    report.results.push({ scenario: 'cold MP3 offline error twice → online Start → pause/resume/replay; nine languages; offline reload; ka text path; Back', width, pass: true });
  }
  // Explicit unsupported language must beat stored preferences, without executing audio.
  for (const width of [1280, 320]) for (const storage of ['saved-pl', 'corrupt']) {
    const { ctx, page } = await context(width, storage === 'corrupt' ? storage : '');
    let mediaRequests = 0;
    ctx.on('request', req => { if (new URL(req.url()).pathname.endsWith('.mp3')) mediaRequests++; });
    await ctx.addInitScript(({ saved }) => {
      if (saved) localStorage.setItem('cxDragonGuide:lang', 'pl');
      window.__acceptanceAudioCalls = 0;
      HTMLMediaElement.prototype.play = function () {
        window.__acceptanceAudioCalls++;
        return Promise.reject(new Error('Audio execution forbidden in fallback-only test'));
      };
      if (window.speechSynthesis) window.speechSynthesis.speak = function () { window.__acceptanceAudioCalls++; };
    }, { saved: storage === 'saved-pl' });
    const honestFallback = async () => {
      assert.equal(await page.locator('html').getAttribute('lang'), 'tr');
      assert.equal(await page.locator('#languageSelect').inputValue(), 'tr');
      assert.equal(await page.locator('#audioLanguageNotice').isVisible(), true);
      assert.match(await page.locator('#audioLanguageNotice').innerText(), /İngilizce/);
      assert.equal(await page.locator('#languageFallback').isVisible(), false);
      assert.ok((await page.locator('#speechText').innerText()).length > 30);
      assert.equal(await page.locator('audio').getAttribute('src'), null);
      assert.equal(await page.evaluate(() => window.__acceptanceAudioCalls), 0);
      assert.equal(mediaRequests, 0);
    };
    await page.goto(`${base}?lang=tr&welcome=1`); await ready(page); await controlled(page);
    await honestFallback();
    await page.reload(); await ready(page); await honestFallback();
    await shot(page, `tr-${storage}-${width}`);
    await keyboard(page, 'skipButton');
    await page.waitForURL(/citronex-hydra-project/);
    assert.equal(new URL(page.url()).searchParams.get('lang'), 'tr', 'Selected text-language handoff');
    await page.goBack(); await ready(page); await honestFallback();
    if (storage === 'corrupt') assert.equal(await page.evaluate(() => localStorage.getItem('unrelated')), 'keep');
    await page.locator('#languageSelect').selectOption('en');
    assert.equal(new URL(page.url()).searchParams.get('lang'), 'en');
    assert.equal(await page.locator('#languageFallback').isVisible(), false);
    await page.reload(); await ready(page);
    assert.equal(await page.locator('#languageFallback').isVisible(), false);
    await page.locator('#languageSelect').selectOption('ua');
    assert.equal(new URL(page.url()).searchParams.get('lang'), 'ua');
    assert.equal(await page.locator('#languageFallback').isVisible(), false);
    assert.equal(await page.locator('html').getAttribute('lang'), 'uk');
    assert.equal(await page.evaluate(() => window.__acceptanceAudioCalls), 0);
    assert.equal(mediaRequests, 0);
    report.results.push({ scenario: 'explicit tr text path; English-audio notice; keyboard handoff; reload/Back; no audio execution/request', width, storage, pass: true });
  }
  for (const storage of ['corrupt', 'denied']) {
    const { page } = await context(320, storage);
    await page.goto(`${base}?welcome=1`); await ready(page);
    await page.locator('[data-gate-lang="en"]').waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'startButton');
    await keyboard(page, 'startButton'); await playing(page); await keyboard(page, 'pauseButton');
    await page.locator('#languageSelect').selectOption('ua');
    if (storage === 'corrupt') assert.equal(await page.evaluate(() => localStorage.getItem('unrelated')), 'keep');
    await shot(page, `storage-${storage}`);
    report.results.push({ scenario: storage + ' storage: usable keyboard/audio/language', pass: true });
  }
  for (const width of [1280, 320]) for (const outcome of ['success', 'denied', 'unavailable', 'pending']) {
    const { ctx, page } = await context(width);
    await ctx.addInitScript(({ outcome }) => {
      window.__copiedLinks = [];
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: outcome === 'unavailable' ? undefined : {
        writeText(value) {
          window.__copiedLinks.push(value);
          if (outcome === 'pending') return new Promise(resolve => { window.__settleCopy = resolve; });
          return outcome === 'denied' ? Promise.reject(new Error('Clipboard denied fixture')) : Promise.resolve();
        }
      } });
    }, { outcome });
    await page.goto(`${base}?lang=tr&location=ryczywol&welcome=1&token=private&progress=99#private-state`);
    await ready(page); await controlled(page);
    await keyboard(page, 'copyGuideLink');
    const expected = 'https://oleksandrkiris.github.io/citronex-dragon-guide/?lang=tr&location=ryczywol&welcome=1';
    if (outcome !== 'unavailable') assert.equal(await page.evaluate(() => window.__copiedLinks[0]), expected);
    if (outcome === 'pending') {
      await page.locator('#languageSelect').selectOption('ua');
      await page.evaluate(() => window.__settleCopy());
      // Cross one rendering turn so the stale promise continuation has run.
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
      assert.equal(await page.locator('#copyGuideStatus').innerText(), '');
      assert.equal(await page.locator('#manualGuideLink').isVisible(), false);
      assert.equal(new URL(await page.locator('#guideLinkURL').inputValue()).searchParams.get('lang'), 'ua');
    } else if (outcome === 'success') {
      await page.getByText('Bağlantı kopyalandı.', { exact: true }).waitFor();
      assert.equal(await page.locator('#manualGuideLink').isVisible(), false);
    } else {
      await page.locator('#manualGuideLink').waitFor({ state: 'visible' });
      assert.equal(await page.locator('#guideLinkURL').inputValue(), expected);
      assert.equal(await page.locator('#guideLinkURL').getAttribute('readonly'), '');
      assert.equal(await page.getByLabel('Rehber bağlantısı', { exact: true }).count(), 1);
      assert.equal(await page.evaluate(() => document.activeElement.id), 'guideLinkURL');
      assert.equal(await page.locator('#guideLinkURL').evaluate(n => n.selectionEnd - n.selectionStart), expected.length);
      assert.equal(await page.locator('#copyGuideStatus').innerText(), 'Aşağıdaki bağlantıyı elle kopyalayın.');
    }
    await shot(page, `copy-${outcome}-${width}`);
    await page.locator('#languageSelect').selectOption('en');
    assert.equal(await page.locator('#copyGuideStatus').innerText(), '');
    assert.equal(await page.locator('#manualGuideLink').isVisible(), false);
    assert.equal(new URL(await page.locator('#guideLinkURL').inputValue()).searchParams.get('lang'), 'en');
    await page.reload(); await ready(page);
    assert.equal(new URL(await page.locator('#guideLinkURL').inputValue()).searchParams.get('lang'), 'en');
    await keyboard(page, 'skipButton'); await page.waitForURL(/citronex-ryczywol-szkolenie/);
    await page.goBack(); await ready(page);
    assert.equal(new URL(await page.locator('#guideLinkURL').inputValue()).searchParams.get('lang'), 'en');
    assert.equal(await page.locator('audio').getAttribute('src'), null);
    report.results.push({ scenario: 'public guide copy; clipboard fixture only; sanitized URL; manual selection; stale completion; language/reload/Back; no audio', width, outcome, pass: true });
  }
  for (const width of [1280, 320]) for (const selected of ['ka', 'tr', 'hy']) for (const storage of ['clean', 'corrupt', 'denied']) {
    const { ctx, page } = await context(width, storage === 'clean' ? '' : storage);
    await ctx.addInitScript(() => {
      window.__textAudioCalls = 0;
      HTMLMediaElement.prototype.play = function () { window.__textAudioCalls++; return Promise.reject(Error('Explicit EN audio rejected by fixture')); };
      if (window.speechSynthesis) window.speechSynthesis.speak = function () { throw Error('New-language TTS forbidden'); };
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: value => { window.__textCopied = value; return Promise.resolve(); } }, configurable: true });
    });
    await page.goto(`${base}?welcome=1`); await ready(page);
    await keyboard(page, `gate-${selected}`);
    assert.equal(await page.locator('html').getAttribute('lang'), selected);
    assert.equal(await page.locator('#textPathControls').isVisible(), true);
    for (const id of ['speechText','textStep1','textStep2','textStep3','audioLanguageNotice','targetLanguageNotice']) assert.ok((await page.locator('#'+id).innerText()).length > 10, id);
    assert.equal(await page.locator('audio').getAttribute('src'), null);
    assert.equal(await page.evaluate(() => window.__textAudioCalls), 0);
    for (const location of ['siechnice','ryczywol','zgorzelec_bogatynia']) {
      await page.locator('#locationSelect').selectOption(location);
      assert.equal(new URL(page.url()).searchParams.get('location'), location);
      assert.ok((await page.locator('#speechText').innerText()).length > 100);
      await keyboard(page, 'copyGuideLink');
      const copied = new URL(await page.evaluate(() => window.__textCopied));
      assert.equal(copied.searchParams.get('lang'), selected);
      assert.equal(copied.searchParams.get('location'), location);
      await page.reload(); await ready(page);
      assert.equal(await page.locator('#locationSelect').inputValue(), location);
    }
    await shot(page, `text-${selected}-${storage}-${width}`);
    await keyboard(page, 'startButton');
    await page.waitForFunction(() => window.__textAudioCalls === 1);
    assert.match(await page.locator('audio').getAttribute('src'), /intro-en\.mp3/);
    await page.locator('#openButton').waitFor({ state: 'visible' });
    const status = await page.locator('#audioStatus').innerText();
    assert.ok(status.length > 15);
    await keyboard(page, 'openButton'); await page.waitForURL(/citronex-zgorzelec-bogatynia-szkolenie/);
    assert.equal(new URL(page.url()).searchParams.get('lang'), selected);
    await page.goBack(); await ready(page);
    assert.equal(await page.locator('#languageSelect').inputValue(), selected);
    await controlled(page); await offline(ctx, true); await page.reload(); await ready(page);
    assert.equal(await page.locator('html').getAttribute('lang'), selected);
    assert.equal(await page.locator('#locationSelect').inputValue(), 'zgorzelec_bogatynia');
    assert.equal(await page.evaluate(() => navigator.onLine), false);
    assert.equal(await page.locator('audio').getAttribute('src'), null);
    if (storage === 'corrupt') assert.equal(await page.evaluate(() => localStorage.getItem('unrelated')), 'keep');
    await shot(page, `text-offline-${selected}-${storage}-${width}`);
    await offline(ctx, false);
    report.results.push({ scenario: 'ka/tr/hy text path: keyboard language, three locations, copy, reload/Back, blocked/corrupt storage, offline, explicit English audio failure fixture/no TTS', width, selected, storage, pass: true });
  }
  oldVersion = true;
  const { ctx, page } = await context(320);
  await page.goto(`${base}?location=ryczywol&lang=ua&welcome=1`); await ready(page); await controlled(page);
  await keyboard(page, 'skipButton'); await page.waitForURL(/citronex-ryczywol-szkolenie/);
  await page.goBack(); await ready(page);
  const seen = 'cxDragonGuide:ryczywol:seen:20260717-location-copy';
  assert.equal(await page.evaluate(key => localStorage.getItem(key), seen), '1');
  await page.evaluate(async () => { localStorage.setItem('unrelated', 'keep'); await caches.open('unrelated-cache'); });
  await page.evaluate(() => { window.__baseController = navigator.serviceWorker.controller; });
  oldVersion = false;
  await page.evaluate(async () => { const reg = await navigator.serviceWorker.ready; await reg.update(); });
  await page.waitForFunction(async ({ baseCache, headCache, predicate }) => {
    const reg = await navigator.serviceWorker.ready;
    const controller = navigator.serviceWorker.controller;
    return Function('return (' + predicate + ')')()({
      keys: await caches.keys(), baseCache, headCache,
      controllerChanged: Boolean(controller && controller !== window.__baseController),
      activated: Boolean(controller && controller.state === 'activated' && reg.active === controller)
    });
  }, { baseCache, headCache, predicate: headUpgradeReady.toString() });
  await page.reload(); await ready(page); await controlled(page);
  assert.equal(await page.evaluate(key => localStorage.getItem(key), seen), '1');
  assert.equal(await page.evaluate(() => localStorage.getItem('unrelated')), 'keep');
  assert.equal(await page.locator('#languageSelect').inputValue(), 'ua');
  assert.ok((await page.evaluate(() => caches.keys())).includes('unrelated-cache'));
  await offline(ctx, true); await page.reload(); await ready(page);
  assert.equal(await page.locator('#languageSelect').inputValue(), 'ua');
  assert.equal(await page.evaluate(key => localStorage.getItem(key), seen), '1');
  // The old helper could pass on the base cache before head activation.
  // With the origin stopped, prove head behavior and exact head JS bytes.
  await page.goto(`${base}?lang=tr&welcome=1`); await ready(page); await controlled(page);
  await page.reload(); await ready(page);
  assert.equal(await page.evaluate(() => navigator.onLine), false);
  assert.equal(await page.locator('html').getAttribute('lang'), 'tr');
  assert.equal(await page.locator('#audioLanguageNotice').isVisible(), true);
  assert.match(await page.locator('#audioLanguageNotice').innerText(), /İngilizce/);
  assert.equal(await page.locator('audio').getAttribute('src'), null);
  assert.equal(await page.evaluate(key => localStorage.getItem(key), seen), '1');
  assert.equal(await page.evaluate(() => localStorage.getItem('unrelated')), 'keep');
  const offlineScriptHash = await page.evaluate(async headCache => {
    const cache = await caches.open(headCache);
    const script = Array.from(document.scripts).find(node => node.src.includes('/assets/guide.js'));
    const response = await cache.match(script.src);
    if (!response) throw new Error('HEAD script absent from HEAD cache');
    const hash = await crypto.subtle.digest('SHA-256', await response.arrayBuffer());
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
  }, headCache);
  assert.equal(offlineScriptHash, sha256(current.get('assets/guide.js')), 'Offline HEAD JS hash');
  report.cache = await page.evaluate(async headCache => {
    const c = await caches.open(headCache);
    const rows = []; for (const req of await c.keys()) { const res = await c.match(req); rows.push({ url: req.url, bytes: (await res.arrayBuffer()).byteLength }); } return rows;
  }, headCache);
  report.cacheUpgrade = { baseCache, headCache, offlineScriptHash, offlineHeadTurkishText: true };
  await shot(page, 'cache-upgrade-offline');
  report.results.push({ scenario: 'actual base SW → head SW; old cache deleted; preserved language/seen/unrelated; offline HEAD tr text and JS hash', pass: true });
  assert.deepEqual(report.errors, []);
  assert.ok(report.blocked.every(r => ['GET', 'HEAD'].includes(r.method)), 'No submissions');
  report.pass = true;
} catch (err) {
  report.pass = false; report.failure = err.stack; process.exitCode = 1;
  if (activePage) await activePage.screenshot({ path: join(reportDir, 'failure.png'), fullPage: true }).catch(() => {});
} finally {
  for (const [i, ctx] of contexts.entries()) await ctx.tracing.stop({ path: join(reportDir, `trace-${i}.zip`) }).catch(() => {});
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
  report.finished = new Date().toISOString();
  await writeFile(join(reportDir, 'acceptance.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ pass: report.pass, results: report.results, failure: report.failure, head: report.head }));
}
