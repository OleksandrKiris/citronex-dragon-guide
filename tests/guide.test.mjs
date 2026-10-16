import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { createHash } from "node:crypto";

const source = await fs.readFile(new URL("../assets/guide.js", import.meta.url), "utf8");
const locales = ["pl", "en", "ua", "ru", "az", "es", "fil", "id", "ne"];
const targets = { siechnice: "citronex-siechnice-szkolenie", ryczywol: "citronex-ryczywol-szkolenie", zgorzelec_bogatynia: "citronex-zgorzelec-bogatynia-szkolenie" };

function boot(query = "location=siechnice&lang=pl&welcome=1", options = {}) {
  const nodes = new Map(), timers = [], redirects = [], reads = [], utterances = [], playRequests = [], storage = new Map(Object.entries(options.storage || {}));
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
        pause() { this.paused = true; }, play() { if (options.rejectAudio) return Promise.reject(Error("Audio unavailable")); this.paused = false; return options.deferAudio ? new Promise((resolve, reject) => playRequests.push({ resolve, reject })) : Promise.resolve(); }
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
  if (options.speech) window.speechSynthesis = {
    getVoices: () => options.deferVoice ? [] : ["pl-PL", "en-US", "uk-UA", "ru-RU", "az-AZ", "es-ES", "fil-PH", "id-ID", "ne-NP"].map(lang => ({ lang })),
    cancel() { this.cancelCount = (this.cancelCount || 0) + 1; },
    speak(utterance) { utterances.push(utterance); },
    pause() { this.paused = true; }, resume() { this.paused = false; }
  };
  const context = vm.createContext({ window, document, localStorage, URL, URLSearchParams, history: { state: null, replaceState(_a, _b, value) { if (options.blockedHistory) throw Error("History blocked"); location.href = String(value); location.search = new URL(value).search; } },
    navigator: { language: "pl", languages: ["pl"] }, clearTimeout(id) { if (timers[id - 1]) timers[id - 1].cancelled = true; }, console,
    SpeechSynthesisUtterance: function(text) { this.text = text; },
    fetch() { throw Error("Network and candidate operations forbidden"); } });
  vm.runInContext(source, context);
  return { node, links, location, document, timers, redirects, storage, reads, utterances, playRequests, synth: window.speechSynthesis, choose(lang) { node("languageSelect").value = lang; node("languageSelect").emit("change"); } };
}

for (const lang of locales) test(`${lang}: changing language cancels speech and ignores its late events`, () => {
  const c = boot(`location=siechnice&lang=${lang}&welcome=1`, { speech: true });
  c.node("startButton").emit("click");
  const previous = c.utterances[0];
  assert.ok(previous);
  previous.onstart();
  const cancellations = c.synth.cancelCount;
  c.choose(lang === "en" ? "ua" : "en");
  assert.ok(c.synth.cancelCount > cancellations);
  const status = c.node("audioStatus").textContent;
  previous.onstart(); previous.onpause(); previous.onresume(); previous.onend(); previous.onerror();
  assert.equal(c.node("audioStatus").textContent, status);
  assert.equal(c.node("startButton").hidden, false);
  assert.equal(c.node("pauseButton").hidden, true);
  assert.equal(c.timers.filter(timer => !timer.cancelled).length, 0);
  assert.equal(c.redirects.length, 0);
});

for (const lang of locales) test(`${lang}: location speech exposes pause/resume and replay controls`, () => {
  const c = boot(`location=siechnice&lang=${lang}&welcome=1`, { speech: true });
  const pauseLabel = c.node("pauseButton").textContent;
  c.node("startButton").emit("click");
  const speech = c.utterances[0];
  speech.onstart();
  const playingStatus = c.node("audioStatus").textContent;
  assert.equal(c.node("pauseButton").hidden, false, "Pause must be reachable during location speech");
  assert.equal(c.node("replayButton").hidden, false);
  assert.equal(c.node("startButton").hidden, true);
  c.node("pauseButton").emit("click");
  assert.equal(c.synth.paused, true);
  assert.notEqual(c.node("pauseButton").textContent, pauseLabel);
  assert.notEqual(c.node("audioStatus").textContent, playingStatus);
  c.node("pauseButton").emit("click");
  assert.equal(c.synth.paused, false);
  assert.equal(c.node("pauseButton").textContent, pauseLabel);
  assert.equal(c.node("audioStatus").textContent, playingStatus);
  assert.equal(c.redirects.length, 0, "Pause/resume must not complete or leave the guide");
  assert.equal(c.utterances.length, 1, "Resume continues the same instructions");
});

test("recording failure exposes the same controls when browser speech starts", async () => {
  const c = boot("lang=en&welcome=1", { speech: true, rejectAudio: true });
  c.node("startButton").emit("click");
  await Promise.resolve(); await Promise.resolve();
  c.utterances[0].onstart();
  assert.equal(c.node("pauseButton").hidden, false);
  assert.equal(c.node("replayButton").hidden, false);
  assert.equal(c.node("startButton").hidden, true);
  c.node("pauseButton").emit("click");
  assert.equal(c.node("audioStatus").textContent, "Audio paused.");
});

test("replaying paused speech releases the paused engine before starting the new instructions", () => {
  const c = boot("location=ryczywol&lang=en&welcome=1", { speech: true });
  c.node("startButton").emit("click");
  c.utterances[0].onstart();
  c.node("pauseButton").emit("click");
  assert.equal(c.synth.paused, true);
  c.node("replayButton").emit("click");
  assert.equal(c.synth.paused, false, "cancel() alone does not reset the speech engine's paused state");
  assert.equal(c.utterances.length, 2);
});

test("native speech pause and resume events keep the visible status in sync", () => {
  const c = boot("location=ryczywol&lang=en&welcome=1", { speech: true });
  c.node("startButton").emit("click");
  const speech = c.utterances[0];
  speech.onstart();
  speech.onpause();
  assert.equal(c.node("audioStatus").textContent, "Audio paused.");
  assert.equal(c.node("pauseButton").textContent, "Resume");
  speech.onresume();
  assert.equal(c.node("pauseButton").textContent, "Pause");
  assert.match(c.node("audioStatus").textContent, /speaking/);
  speech.onend();
  assert.equal(c.node("pauseButton").hidden, true);
  assert.equal(c.node("openButton").hidden, false);
});

test("changing language while speech is paused permits a new explicit start", () => {
  const c = boot("location=siechnice&lang=en&welcome=1", { speech: true });
  c.node("startButton").emit("click");
  c.utterances[0].onstart();
  c.node("pauseButton").emit("click");
  c.choose("ua");
  assert.equal(c.utterances.length, 1, "Changing language must not automatically speak");
  c.node("startButton").emit("click");
  assert.equal(c.synth.paused, false);
  assert.equal(c.utterances.length, 2);
  assert.equal(c.utterances[1].lang, "uk-UA");
  c.utterances[1].onstart();
  assert.equal(c.node("pauseButton").hidden, false);
});

test("a voice discovered after a language change cannot start the old speech", () => {
  const c = boot("location=ryczywol&lang=en&welcome=1", { speech: true, deferVoice: true });
  c.node("startButton").emit("click");
  c.choose("ua");
  c.timers.find(timer => timer.ms === 450).fn();
  assert.equal(c.utterances.length, 0);
});

for (const outcome of ["resolve", "reject"]) test(`late audio ${outcome} cannot change the new language screen`, async () => {
  const c = boot("lang=en&welcome=1", { deferAudio: true, speech: true });
  c.node("startButton").emit("click");
  c.choose("ua");
  const status = c.node("audioStatus").textContent;
  c.playRequests[0][outcome](outcome === "reject" ? Error("aborted old source") : undefined);
  await Promise.resolve(); await Promise.resolve();
  assert.equal(c.node("audioStatus").textContent, status);
  assert.equal(c.node("startButton").hidden, false);
  assert.equal(c.node("pauseButton").hidden, true);
  assert.equal(c.utterances.length, 0);
  c.node("guideAudio").emit("error");
  c.node("guideAudio").emit("ended");
  assert.equal(c.utterances.length, 0);
  assert.equal(c.timers.filter(timer => !timer.cancelled).length, 0);
});

test("switching language after completion cancels the pending automatic redirect", () => {
  const c = boot("location=ryczywol&lang=en&welcome=1", { speech: true });
  c.node("startButton").emit("click");
  c.utterances[0].onend();
  const redirect = c.timers.find(timer => timer.ms === 1100);
  assert.ok(redirect);
  c.choose("ua");
  assert.equal(redirect.cancelled, true);
  redirect.fn(); // Also protect a callback already queued by the browser.
  assert.equal(c.redirects.length, 0);
  c.node("skipButton").emit("click");
  assert.equal(new URL(c.redirects[0]).searchParams.get("lang"), "ua");
});

test("changing language while paused restores start and selects the new recording", async () => {
  const c = boot("lang=en&welcome=1");
  c.node("startButton").emit("click");
  await Promise.resolve();
  c.node("pauseButton").emit("click");
  c.choose("ua");
  assert.equal(c.node("startButton").hidden, false);
  assert.equal(c.node("pauseButton").hidden, true);
  c.node("startButton").emit("click");
  await Promise.resolve();
  assert.match(c.node("guideAudio").src, /intro-ua\.mp3/);
  assert.equal(c.node("pauseButton").textContent, "Пауза");
});

for (const speech of [false, true]) test(`${speech ? "speech" : "recording"}: current playback still completes and opens the correct destination`, async () => {
  const c = boot(`${speech ? "location=ryczywol&" : ""}lang=ua&welcome=1`, { speech });
  c.node("startButton").emit("click");
  await Promise.resolve();
  if (speech) c.utterances[0].onend(); else c.node("guideAudio").emit("ended");
  assert.equal(c.node("openButton").hidden, false);
  const redirects = c.timers.filter(timer => timer.ms === 1100 && !timer.cancelled);
  assert.equal(redirects.length, 1);
  redirects[0].fn();
  assert.equal(new URL(c.redirects[0]).searchParams.get("lang"), "ua");
  assert.equal(new URL(c.redirects[0]).pathname, speech ? "/citronex-ryczywol-szkolenie/" : "/citronex-hydra-project/");
});

test("replay invalidates the old speech and only the new one can complete", () => {
  const c = boot("location=siechnice&lang=en&welcome=1", { speech: true });
  c.node("startButton").emit("click");
  c.node("replayButton").emit("click");
  assert.equal(c.utterances.length, 2);
  c.utterances[0].onend();
  assert.equal(c.timers.length, 0);
  c.utterances[1].onend();
  assert.equal(c.timers.length, 1);
});

test("a failed resume exposes the text fallback and direct continue action", async () => {
  const options = {};
  const c = boot("lang=en&welcome=1", options);
  c.node("startButton").emit("click");
  await Promise.resolve();
  c.node("pauseButton").emit("click");
  options.rejectAudio = true;
  c.node("pauseButton").emit("click");
  await Promise.resolve(); await Promise.resolve();
  assert.match(c.node("audioStatus").textContent, /unavailable/);
  assert.equal(c.node("openButton").hidden, false);
  assert.equal(c.node("pauseButton").hidden, true);
});

test("saved language is read once instead of repeating a synchronous storage lookup", () => {
  const c = boot("location=ryczywol&welcome=1", { storage: { "cxDragonGuide:lang": "en" } });
  assert.equal(c.document.documentElement.lang, "en");
  assert.equal(c.reads.filter(key => key === "cxDragonGuide:lang").length, 1);
});

for (const lang of locales) test(`${lang}: PrimServ services preserve supported language without leaking guide parameters`, () => {
  const c = boot(`location=ryczywol&lang=${lang}&welcome=1&context=private`, { blocked: true });
  const jobs = new URL(c.node("jobsLink").href);
  assert.equal(jobs.origin, "https://oleksandrkiris.github.io");
  assert.equal(jobs.pathname, "/kiris-jobs/");
  assert.equal(jobs.search, `?lang=${lang === "ua" ? "uk" : lang}`);
  assert.ok(c.node("companyLink").textContent.includes("PrimServ"));
  assert.ok(c.node("jobsLink").textContent.length > 2);
  assert.ok(c.node("botLink").textContent.includes("Telegram"));
  assert.match(c.node("hydraLink").textContent, /Hydr/);
  c.choose(lang === "en" ? "ua" : "en");
  assert.equal(new URL(c.node("jobsLink").href).searchParams.get("lang"), lang === "en" ? "uk" : "en");
  assert.equal(c.redirects.length, 0, "Service navigation does not trigger an automatic redirect");
  assert.equal(c.node("guideAudio").loads, undefined, "Service navigation does not preload audio");
});

test("Georgian fallback is visible and service navigation follows the displayed English", () => {
  const c = boot("location=siechnice&lang=ka&welcome=1");
  assert.equal(c.node("languageFallback").hidden, false);
  assert.match(c.node("languageFallback").textContent, /English \(EN\)/);
  assert.equal(new URL(c.node("jobsLink").href).searchParams.get("lang"), "en");
});

test("invalid location still offers language-aware service links and an immediate return", () => {
  const c = boot("location=unknown&lang=uk", { blocked: true });
  assert.equal(c.node("invalidState").hidden, false);
  assert.equal(new URL(c.node("jobsLink").href).searchParams.get("lang"), "uk");
  assert.ok(c.links.every(link => new URL(link.href).searchParams.get("lang") === "ua"));
  assert.equal(c.timers.length, 0);
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

test("real HTML exposes the fallback note and all return links; changed CSS/JS have new cache URLs", async () => {
  const html = await fs.readFile(new URL("../index.html", import.meta.url), "utf8");
  const sw = await fs.readFile(new URL("../sw.js", import.meta.url), "utf8");
  assert.ok(html.includes('id="languageFallback" class="language-fallback" role="status" hidden'));
  assert.equal((html.match(/data-hydra-link/g) || []).length, 3);
  for (const path of ["assets/guide.js", "assets/guide.css"]) {
    const version = path.endsWith(".js") ? "20261016-primserv-guide3" : "20261016-primserv-guide1";
    assert.ok(html.includes(`${path}?v=${version}`));
    assert.ok(sw.includes(`${path}?v=${version}`));
  }
});

test("official PrimServ assets, direct links and manifest stay consistent with the cache", async () => {
  const html = await fs.readFile(new URL("../index.html", import.meta.url), "utf8");
  const manifest = JSON.parse(await fs.readFile(new URL("../manifest.webmanifest", import.meta.url), "utf8"));
  const sw = await fs.readFile(new URL("../sw.js", import.meta.url), "utf8");
  for (const [name, expected] of Object.entries({
    "primserv-logo.svg": "1a29802a4a0065ad84e8f8dbdd5bc46dcb9b67bbecb2190de6a99464feaf5157",
    "primserv-icon-192.png": "4b93c4c36e29ec11fc4320703a39a06bd956e4f6dfec4a6a84ad906b6ab674e5"
  })) {
    const bytes = await fs.readFile(new URL(`../assets/brand/${name}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected);
    assert.ok(sw.includes(`./assets/brand/${name}`));
  }
  assert.match(html, /id="companyLink" href="https:\/\/www\.primserv\.pl\/"/);
  assert.match(html, /id="botLink" href="https:\/\/t\.me\/KirisWorkPoland_bot"/);
  assert.match(html, /<nav class="service-nav" aria-label="PrimServ">/);
  assert.ok(html.includes('name="theme-color" content="' + manifest.theme_color + '"'));
  assert.equal(manifest.short_name, "PrimServ");
  assert.equal(manifest.icons[0].sizes, "192x192");
  assert.ok(html.includes("manifest.webmanifest?v=20261016-primserv-guide1"));
  assert.ok(sw.includes("manifest.webmanifest?v=20261016-primserv-guide1"));
  assert.ok(!html.includes("assets/brand/citronex-hydra-logo-web.png"));
  assert.ok(!sw.includes("assets/brand/citronex-hydra-logo-web.png"));
});
