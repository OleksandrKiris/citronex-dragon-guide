import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { createHash } from "node:crypto";

const source = await fs.readFile(new URL("../assets/guide.js", import.meta.url), "utf8");
const locales = ["pl", "en", "ua", "ru", "az", "es", "fil", "id", "ne"];
const targets = { siechnice: "citronex-siechnice-szkolenie", ryczywol: "citronex-ryczywol-szkolenie", zgorzelec_bogatynia: "citronex-zgorzelec-bogatynia-szkolenie" };

function boot(query = "location=siechnice&lang=pl&welcome=1", options = {}) {
  const nodes = new Map(), timers = [], redirects = [], reads = [], storage = new Map(Object.entries(options.storage || {}));
  function node(id) {
    if (!nodes.has(id)) {
      const handlers = new Map();
      nodes.set(id, { id, hidden: ["guideApp", "invalidState", "languageGate", "openButton", "pauseButton", "replayButton"].includes(id), textContent: "", value: "", href: "", src: "", paused: true,
        classList: { add() {}, toggle() {}, remove() {} },
        addEventListener(key, fn) { if (!handlers.has(key)) handlers.set(key, []); handlers.get(key).push(fn); },
        emit(key) { for (const fn of handlers.get(key) || []) fn({ target: this }); },
        querySelector: () => ({ focus() {} }), querySelectorAll: () => [],
        setAttribute(key, value) { this[key] = value; },
        focus() {}, load() { this.loads = (this.loads || 0) + 1; },
        pause() { this.paused = true; }, play() { if (options.rejectAudio) return Promise.reject(Error("Audio unavailable")); this.paused = false; return Promise.resolve(); }
      });
    }
    return nodes.get(id);
  }
  const url = new URL("https://oleksandrkiris.github.io/citronex-dragon-guide/?" + query + "#guideApp");
  const location = { href: url.href, search: url.search, assign: value => redirects.push(value) };
  const localStorage = {
    getItem(key) { reads.push(key); if (options.blocked || options.blockedRead) throw Error("Storage blocked"); return storage.get(key) || null; },
    setItem(key, value) { if (options.blocked || options.blockedWrite) throw Error("Storage blocked"); storage.set(key, value); }
  };
  const links = ["brand", "returnLink", "invalidReturn"].map(node);
  const document = { getElementById: node, documentElement: { lang: "" }, body: { classList: { add() {} } },
    querySelectorAll: selector => selector === "[data-hydra-link]" ? links : [] };
  const window = { location, localStorage, setTimeout(fn, ms) { timers.push({ fn, ms }); return timers.length; }, addEventListener() {} };
  const context = vm.createContext({ window, document, localStorage, URL, URLSearchParams, history: { state: null, replaceState(_a, _b, value) { if (options.blockedHistory) throw Error("History blocked"); location.href = String(value); location.search = new URL(value).search; } },
    navigator: { language: "pl", languages: ["pl"] }, clearTimeout() {}, console,
    fetch() { throw Error("Network and candidate operations forbidden"); } });
  vm.runInContext(source, context);
  return { node, links, location, document, timers, redirects, storage, reads, choose(lang) { node("languageSelect").value = lang; node("languageSelect").emit("change"); } };
}

test("saved language is read once instead of repeating a synchronous storage lookup", () => {
  const c = boot("location=ryczywol&welcome=1", { storage: { "cxDragonGuide:lang": "en" } });
  assert.equal(c.document.documentElement.lang, "en");
  assert.equal(c.reads.filter(key => key === "cxDragonGuide:lang").length, 1);
});

test("blocked storage does not prevent the guide from loading or opening training", () => {
  const c = boot("location=siechnice&lang=ua&welcome=1", { blocked: true });
  assert.equal(c.node("guideApp").hidden, false);
  c.node("skipButton").emit("click");
  assert.equal(new URL(c.redirects[0]).searchParams.get("lang"), "ua");
});

for (const restriction of ["blockedRead", "blockedWrite", "blockedHistory"]) test(`${restriction}: optional browser features do not block language choice or training`, () => {
  const c = boot("location=ryczywol&lang=en&welcome=1", { [restriction]: true });
  c.choose("ua");
  c.node("skipButton").emit("click");
  assert.equal(new URL(c.redirects[0]).searchParams.get("lang"), "ua");
});

for (const lang of locales) for (const [location, path] of Object.entries(targets)) {
  test(`${lang}/${location}: direct training target stays allowlisted and context survives language changes`, () => {
    const c = boot(`location=${location}&lang=${lang}&welcome=1&context=fixture`);
    assert.equal(c.node("guideAudio").loads, undefined, "No automatic audio download");
    c.choose(lang === "ua" ? "en" : "ua");
    const current = new URL(c.location.href);
    assert.equal(current.searchParams.get("location"), location);
    assert.equal(current.searchParams.get("context"), "fixture");
    assert.equal(current.hash, "#guideApp");
    const selected = lang === "ua" ? "en" : "ua";
    assert.equal(current.searchParams.get("lang"), selected);
    for (const link of c.links) {
      const back = new URL(link.href);
      assert.equal(back.pathname, "/citronex-hydra-project/");
      assert.equal(back.searchParams.get("lang"), selected);
      assert.equal(back.searchParams.has("context"), false);
    }
    c.node("skipButton").emit("click");
    const target = new URL(c.redirects[0]);
    assert.equal(target.pathname, `/${path}/`);
    assert.equal(target.searchParams.get("lang"), selected);
    assert.equal(target.searchParams.get("intro"), "done");
    assert.equal(target.searchParams.has("context"), false);
  });
}

for (const alias of ["uk", "ka", "hy"]) test(`${alias}: explicit link chooses Ukrainian or honest English, not saved Polish`, () => {
  const c = boot(`location=ryczywol&lang=${alias}&welcome=1`, { storage: { "cxDragonGuide:lang": "pl" } });
  const lang = alias === "uk" ? "ua" : "en";
  assert.equal(c.document.documentElement.lang, lang === "ua" ? "uk" : lang);
  assert.equal(c.node("languageFallback").hidden, alias === "uk");
});

test("generic guide audio error keeps the existing text and direct continue button", async () => {
  const c = boot("lang=en&welcome=1", { rejectAudio: true });
  c.node("startButton").emit("click");
  await Promise.resolve(); await Promise.resolve();
  assert.equal(c.node("openButton").hidden, false);
  assert.ok(c.node("speechText").textContent.length > 20);
  assert.ok(c.node("audioStatus").textContent.length > 10);
});

test("untrusted location does not schedule or execute a redirect", () => {
  const c = boot("location=https://example.invalid&lang=en");
  assert.equal(c.node("invalidState").hidden, false);
  assert.equal(c.timers.length, 0);
  c.node("skipButton").emit("click");
  assert.equal(c.redirects.length, 0);
});

test("existing completion flag still skips an already seen location", () => {
  const c = boot("location=ryczywol&lang=pl", { storage: { "cxDragonGuide:ryczywol:seen:20260717-location-copy": "1" } });
  assert.equal(c.timers.length, 1);
  assert.equal(c.timers[0].ms, 80);
  c.timers[0].fn();
  assert.equal(new URL(c.redirects[0]).pathname, "/citronex-ryczywol-szkolenie/");
});

test("original spoken instructions, MP3 paths and completion build remain unchanged", () => {
  assert.equal(createHash("sha256").update(source.slice(0, source.indexOf("  const BUILD ="))).digest("hex"), "b44c78726112f91fb5a1d8181b8e6964484a5728fa1b3ad7faa026657bc63e40");
  assert.ok(source.includes('const BUILD = "20260717-location-copy"'));
});

test("real HTML exposes the fallback note and both return links; changed CSS/JS have new cache URLs", async () => {
  const html = await fs.readFile(new URL("../index.html", import.meta.url), "utf8");
  const sw = await fs.readFile(new URL("../sw.js", import.meta.url), "utf8");
  assert.ok(html.includes('id="languageFallback" class="language-fallback" role="status" hidden'));
  assert.equal((html.match(/data-hydra-link/g) || []).length, 2);
  for (const path of ["assets/guide.js", "assets/guide.css"]) {
    assert.ok(html.includes(`${path}?v=20261016-safe-language1`));
    assert.ok(sw.includes(`${path}?v=20261016-safe-language1`));
  }
});
