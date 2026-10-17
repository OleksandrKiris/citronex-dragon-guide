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
        emit(key, event = {}) { for (const fn of handlers.get(key) || []) fn({ target: this, ...event }); },
        querySelector: () => ({ focus() {} }), querySelectorAll: () => [],
        setAttribute(key, value) { this[key] = value; },
        select() { this.selected = true; }, focus() { document.activeElement = this; }, load() { this.loads = (this.loads || 0) + 1; this.error = null; },
        pause() { this.paused = true; }, play() { if (options.rejectAudio || this.error) return Promise.reject(Error("Audio unavailable")); this.paused = false; return options.deferAudio ? new Promise((resolve, reject) => playRequests.push({ resolve, reject })) : Promise.resolve(); }
      });
    }
    return nodes.get(id);
  }
  const url = new URL("https://oleksandrkiris.github.io/citronex-dragon-guide/?" + query + "#guideApp");
  const location = { href: url.href, search: url.search, assign: value => redirects.push(value) };
  const localStorage = {
    getItem(key) { reads.push(key); if (options.blocked || options.blockedRead) throw Error("Storage blocked"); return storage.get(key) || null; },
    removeItem(key) { if (options.blocked || options.blockedWrite) throw Error("Storage blocked"); storage.delete(key); },
    setItem(key, value) { if (options.blocked || options.blockedWrite) throw Error("Storage blocked"); storage.set(key, value); }
  };
  const links = ["brand", "returnLink", "invalidReturn"].map(node);
  node("languageLabel").textContent = "Wybierz język";
  const gateButtons = [...locales.slice(0, -1), "ka", "tr", "hy", locales.at(-1)].map(lang => { const button = node("gate-" + lang); button.dataset = { gateLang: lang }; return button; });
  node("languageGate").querySelectorAll = () => gateButtons;
  node("languageGate").querySelector = selector => gateButtons.find(button => selector === `[data-gate-lang="${button.dataset.gateLang}"]`) || gateButtons[0];
  const background = ["topbar", "serviceNav", "guideApp", "footer"].map(node);
  background[3].inert = true; // Preserve a pre-existing inert section when the gate closes.
  const document = { getElementById: node, documentElement: { lang: "" }, body: { classList: { add() {} } },
    querySelectorAll: selector => selector === "[data-hydra-link]" ? links : selector === ".page-shell > :not(#languageGate)" ? background : [] };
  const window = { location, localStorage, setTimeout(fn, ms) { timers.push({ fn, ms }); return timers.length; }, addEventListener() {} };
  if (options.speech) window.speechSynthesis = {
    getVoices: () => options.deferVoice ? [] : ["pl-PL", "en-US", "uk-UA", "ru-RU", "az-AZ", "es-ES", "fil-PH", "id-ID", "ne-NP"].map(lang => ({ lang })),
    cancel() { this.cancelCount = (this.cancelCount || 0) + 1; },
    speak(utterance) { utterances.push(utterance); },
    pause() { this.paused = true; }, resume() { this.paused = false; }
  };
  const context = vm.createContext({ window, document, localStorage, URL, URLSearchParams, history: { state: null, replaceState(_a, _b, value) { if (options.blockedHistory) throw Error("History blocked"); location.href = String(value); location.search = new URL(value).search; } },
    navigator: { clipboard: options.clipboard, language: options.browserLanguage || "pl", languages: [options.browserLanguage || "pl"] }, clearTimeout(id) { if (timers[id - 1]) timers[id - 1].cancelled = true; }, console,
    SpeechSynthesisUtterance: function(text) { this.text = text; },
    fetch() { throw Error("Network and candidate operations forbidden"); } });
  vm.runInContext(source, context);
  return { node, links, background, gateButtons, location, document, timers, redirects, storage, reads, utterances, playRequests, synth: window.speechSynthesis, choose(lang) { node("languageSelect").value = lang; node("languageSelect").emit("change"); } };
}

test("first-entry language gate contains keyboard focus and isolates the background", () => {
  const c = boot("location=siechnice&welcome=1", { blocked: true });
  const gate = c.node("languageGate");
  assert.equal(gate.hidden, false);
  assert.equal(c.document.activeElement, c.gateButtons[0]);
  assert.ok(c.background.every(node => node.inert), "Background controls must be unavailable while a modal is open");
  let prevented = 0;
  const key = shiftKey => ({ key: "Tab", shiftKey, preventDefault() { prevented += 1; } });
  gate.emit("keydown", key(true));
  assert.equal(c.document.activeElement, c.gateButtons.at(-1));
  gate.emit("keydown", key(false));
  assert.equal(c.document.activeElement, c.gateButtons[0]);
  assert.equal(prevented, 2);
  c.gateButtons[2].focus();
  gate.emit("keydown", key(false));
  assert.equal(prevented, 2, "Interior Tab traversal remains native");
});

test("choosing a language returns focus to the start button without playing or navigating", () => {
  const c = boot("location=ryczywol&welcome=1", { blocked: true, speech: true });
  c.node("gate-ua").emit("click");
  assert.equal(c.node("languageGate").hidden, true);
  assert.equal(c.document.activeElement, c.node("startButton"));
  assert.equal(c.node("startButton").hidden, false);
  assert.equal(c.document.documentElement.lang, "uk");
  assert.equal(c.node("languageLabel").textContent, "Оберіть мову");
  assert.equal(c.background[0].inert, false);
  assert.equal(c.background.at(-1).inert, true, "Existing inert state must survive closing the modal");
  assert.equal(c.utterances.length, 0);
  assert.equal(c.redirects.length, 0);
  assert.equal(c.node("guideAudio").loads || 0, 0);
});

test("first-entry focus follows the detected language", () => {
  const c = boot("location=ryczywol&welcome=1", { browserLanguage: "uk-UA" });
  assert.equal(c.node("languageGate").hidden, false);
  assert.equal(c.document.activeElement, c.node("gate-ua"));
});

test("Escape dismisses first-entry language choice using the detected language without autoplay", () => {
  const c = boot("welcome=1", { blocked: true, speech: true });
  let prevented = false;
  c.node("languageGate").emit("keydown", { key: "Escape", preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(c.node("languageGate").hidden, true);
  assert.equal(c.document.activeElement, c.node("startButton"));
  assert.equal(c.node("languageSelect").value, "pl");
  assert.equal(c.utterances.length, 0);
  assert.equal(c.node("guideAudio").loads || 0, 0);
  assert.equal(c.redirects.length, 0);
});

for (const lang of locales) test(`${lang}: the language select has a localized accessible label`, () => {
  const c = boot(`lang=${lang}&welcome=1`);
  assert.equal(c.node("languageLabel").textContent, c.node("gateTitle").textContent);
  assert.ok(c.node("languageLabel").textContent);
});

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

for (const lang of locales) test(`${lang}: replaying a paused recording restores the pause action`, async () => {
  const c = boot(`lang=${lang}&welcome=1`);
  const pauseLabel = c.node("pauseButton").textContent;
  c.node("startButton").emit("click");
  await Promise.resolve();
  const playingStatus = c.node("audioStatus").textContent;
  c.node("guideAudio").currentTime = 12;
  c.node("pauseButton").emit("click");
  const resumeLabel = c.node("pauseButton").textContent;
  assert.notEqual(resumeLabel, pauseLabel);
  c.node("replayButton").emit("click");
  await Promise.resolve();
  assert.equal(c.node("guideAudio").currentTime, 0);
  assert.equal(c.node("guideAudio").paused, false);
  assert.equal(c.node("pauseButton").hidden, false);
  assert.equal(c.node("pauseButton").textContent, pauseLabel, "Playing audio must offer Pause, not Resume");
  assert.equal(c.node("audioStatus").textContent, playingStatus);
  c.node("pauseButton").emit("click");
  assert.equal(c.node("guideAudio").paused, true);
  assert.equal(c.node("pauseButton").textContent, resumeLabel);
  assert.equal(c.redirects.length, 0);
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

for (const lang of locales) test(`${lang}: explicit replay reloads a failed MP3 without changing its source`, async () => {
  const c = boot(`lang=${lang}&welcome=1`, { blocked: true });
  c.node("startButton").emit("click");
  await Promise.resolve();
  const audio = c.node("guideAudio");
  const originalSource = audio.src;
  const playingStatus = c.node("audioStatus").textContent;
  audio.error = { code: 2 }; // MediaError persists until a new load cycle.
  audio.paused = true;
  audio.emit("error");
  assert.equal(c.node("openButton").hidden, false);
  assert.equal(c.node("replayButton").hidden, false);
  assert.equal(audio.loads, 1, "Failure must not cause a background retry");
  assert.equal(c.timers.length, 0);
  c.node("replayButton").focus();
  c.node("replayButton").emit("click");
  await Promise.resolve(); await Promise.resolve();
  assert.equal(audio.loads, 2, "Retry must reset the failed media resource");
  assert.equal(audio.src, originalSource);
  assert.equal(audio.currentTime, 0);
  assert.equal(audio.paused, false);
  assert.equal(c.node("audioStatus").textContent, playingStatus);
  assert.equal(c.node("pauseButton").hidden, false);
  assert.equal(c.document.activeElement, c.node("replayButton"));
  assert.equal(c.redirects.length, 0);
});

test("healthy replay keeps the buffered recording without another load", async () => {
  const c = boot("lang=en&welcome=1");
  c.node("startButton").emit("click");
  await Promise.resolve();
  c.node("pauseButton").emit("click");
  c.node("replayButton").emit("click");
  await Promise.resolve();
  assert.equal(c.node("guideAudio").loads, 1);
  assert.equal(c.node("guideAudio").paused, false);
});

test("failed retry leaves text and continue available without repeated downloads", async () => {
  const options = {};
  const c = boot("lang=en&welcome=1", options);
  c.node("startButton").emit("click");
  await Promise.resolve();
  const audio = c.node("guideAudio");
  audio.error = { code: 2 };
  audio.emit("error");
  options.rejectAudio = true;
  c.node("replayButton").emit("click");
  await Promise.resolve(); await Promise.resolve();
  assert.equal(audio.loads, 2);
  assert.equal(c.node("openButton").hidden, false);
  assert.equal(c.node("pauseButton").hidden, true);
  assert.equal(c.node("replayButton").hidden, false);
  assert.match(c.node("audioStatus").textContent, /unavailable/);
  assert.ok(c.node("speechText").textContent.length > 20);
  assert.equal(c.timers.length, 0);
  assert.equal(c.redirects.length, 0);
});

test("an initial media failure can be retried with the still-visible start button", async () => {
  const options = { deferAudio: true };
  const c = boot("lang=ka&welcome=1", options);
  c.node("startButton").emit("click");
  const audio = c.node("guideAudio");
  audio.error = { code: 4 };
  audio.emit("error");
  c.playRequests[0].reject(Error("unsupported until load"));
  await Promise.resolve(); await Promise.resolve();
  assert.equal(c.node("startButton").hidden, false);
  assert.equal(c.node("audioLanguageNotice").hidden, false);
  options.deferAudio = false;
  c.node("startButton").emit("click");
  await Promise.resolve();
  assert.equal(audio.loads, 2);
  assert.match(audio.src, /intro-en\.mp3/);
  assert.equal(c.node("pauseButton").hidden, false);
});

test("changing language after a failed source starts only the new language on request", async () => {
  const c = boot("lang=en&welcome=1", { storage: { "unrelated": "keep" } });
  c.node("startButton").emit("click");
  await Promise.resolve();
  const audio = c.node("guideAudio");
  audio.error = { code: 2 };
  audio.emit("error");
  c.choose("ua");
  assert.equal(audio.loads, 1);
  c.node("startButton").emit("click");
  await Promise.resolve();
  assert.match(audio.src, /intro-ua\.mp3/);
  assert.equal(audio.loads, 2);
  assert.equal(c.storage.get("unrelated"), "keep");
  const reloaded = boot("welcome=1", { storage: Object.fromEntries(c.storage) });
  assert.equal(reloaded.document.documentElement.lang, "uk");
  assert.equal(reloaded.node("guideAudio").loads, undefined);
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

test("Georgian text path keeps service navigation Georgian with an English-audio notice", () => {
  const c = boot("location=siechnice&lang=ka&welcome=1");
  assert.equal(c.node("languageFallback").hidden, true);
  assert.equal(c.node("audioLanguageNotice").hidden, false);
  assert.equal(c.document.documentElement.lang, "ka");
  assert.equal(new URL(c.node("jobsLink").href).searchParams.get("lang"), "ka");
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
  const lang = alias === "uk" ? "ua" : alias;
  assert.equal(c.document.documentElement.lang, lang === "ua" ? "uk" : lang);
  assert.equal(c.node("languageFallback").hidden, true);
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

test("existing completion flag stays stored without bypassing explicit location controls", () => {
  const key = 'cxDragonGuide:ryczywol:seen:20260717-location-copy';
  const c = boot('location=ryczywol&lang=pl', { storage: { [key]: '1' } });
  assert.equal(c.timers.length, 0);
  assert.equal(c.redirects.length, 0);
  assert.equal(c.node('guideApp').hidden, false);
  assert.equal(c.storage.get(key), '1');
  assert.equal(c.node('locationSelect').value, 'ryczywol');
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
    const version = path.endsWith(".js") ? "20261018-location-path1" : "20261016-primserv-guide1";
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

// #41 intentionally replaces English UI fallback with a local selected-language text path.
for (const requested of ["ka", "tr", "hy"]) test(`${requested}: full text path without storage or autoplay`, () => {
  const c = boot(`location=ryczywol&lang=${requested}&welcome=1`, { blocked: true, speech: true, browserLanguage: "pl" });
  assert.equal(c.document.documentElement.lang, requested);
  assert.equal(c.node("languageSelect").value, requested);
  assert.equal(c.node("languageFallback").hidden, true);
  for (const id of ['textPathControls', 'audioLanguageNotice', 'targetLanguageNotice']) assert.equal(c.node(id).hidden, false);
  for (const id of ['speechText','guideTitle','textStep1','textStep2','textStep3','startButton','openButton','copyGuideLink','audioLanguageNotice','targetLanguageNotice']) assert.ok(c.node(id).textContent.length > 4, id);
  assert.equal(c.utterances.length, 0);
  assert.equal(c.node("guideAudio").loads || 0, 0);
  assert.equal(c.redirects.length, 0);
  c.choose('en');
  assert.equal(c.node('textPathControls').hidden, true);
  assert.equal(c.document.documentElement.lang, 'en');
});

for (const requested of ['ka','tr','hy']) test(`${requested}: selected-language reload takes precedence over saved Polish`, () => {
  const first = boot(`lang=${requested}&welcome=1`, { storage: { 'cxDragonGuide:lang': 'pl' } });
  const reloaded = boot(first.location.search.slice(1), { storage: Object.fromEntries(first.storage) });
  assert.equal(reloaded.document.documentElement.lang, requested);
  assert.equal(new URL(reloaded.location.href).searchParams.get('lang'), requested);
  assert.equal(reloaded.node('speechText').textContent, first.node('speechText').textContent);
  reloaded.node('skipButton').emit('click');
  assert.equal(new URL(reloaded.redirects[0]).searchParams.get('lang'), requested);
});

for (const selected of ['en', 'ua']) test(`tr: explicit manual ${selected} replaces requested context and preserves other URL parts`, () => {
  const c = boot('lang=tr&welcome=1&context=keep&location=ryczywol');
  assert.equal(new URL(c.location.href).searchParams.get('lang'), 'tr');
  c.choose(selected);
  const url = new URL(c.location.href);
  assert.equal(url.searchParams.get('lang'), selected);
  assert.equal(url.searchParams.get('context'), 'keep');
  assert.equal(url.searchParams.get('location'), 'ryczywol');
  assert.equal(url.hash, '#guideApp');
  assert.equal(c.node('languageFallback').hidden, true);
  const reloaded = boot(url.search.slice(1));
  assert.equal(reloaded.document.documentElement.lang, selected === 'ua' ? 'uk' : 'en');
  assert.equal(reloaded.node('languageFallback').hidden, true);
});

for (const requested of ['tr', 'ka', 'hy', 'uk']) test(`${requested}: copied public link retains requested context and strips unrelated state`, async () => {
  const writes = [];
  const c = boot(`lang=${requested}&location=ryczywol&token=private&progress=99&context=secret`, { clipboard: { writeText: async value => writes.push(value) } });
  c.node('copyGuideLink').emit('click'); await new Promise(setImmediate);
  const url = new URL(writes[0]);
  assert.equal(url.origin + url.pathname, 'https://oleksandrkiris.github.io/citronex-dragon-guide/');
  assert.equal(url.searchParams.get('lang'), requested === 'uk' ? 'ua' : requested);
  assert.deepEqual([...url.searchParams.keys()].sort(), ['lang', 'location', 'welcome']);
  assert.equal(url.hash, '#guideApp');
  assert.equal(c.node('manualGuideLink').hidden, true);
  assert.ok(c.node('copyGuideStatus').textContent);
  assert.equal(c.node('guideAudio').loads || 0, 0);
  assert.equal(c.redirects.length, 0);
});

for (const clipboard of [undefined, { writeText: async () => { throw Error('denied'); } }]) test('clipboard refusal/unavailable exposes readonly URL for manual selection', async () => {
  const c = boot('lang=en&location=invalid&secret=private', { clipboard });
  c.node('copyGuideLink').emit('click'); await new Promise(setImmediate);
  assert.equal(c.node('manualGuideLink').hidden, false);
  assert.equal(c.document.activeElement, c.node('guideLinkURL'));
  assert.equal(c.node('guideLinkURL').selected, true);
  assert.equal(new URL(c.node('guideLinkURL').value).searchParams.has('location'), false);
  assert.match(c.node('copyGuideStatus').textContent, /manually/);
});

for (const reject of [false, true]) test(`late clipboard ${reject ? 'failure' : 'success'} cannot overwrite a new language`, async () => {
  let settle;
  const c = boot('lang=tr&welcome=1', { clipboard: { writeText: () => new Promise((resolve, fail) => { settle = reject ? () => fail(Error('denied')) : resolve; }) } });
  c.node('copyGuideLink').emit('click'); c.choose('ua'); settle();
  await new Promise(setImmediate);
  assert.equal(c.node('copyGuideStatus').textContent, '');
  assert.equal(c.node('manualGuideLink').hidden, true);
  assert.equal(new URL(c.node('guideLinkURL').value).searchParams.get('lang'), 'ua');
});

test('only existing public guide anchor is retained; manual EN replaces fallback in copied link', async () => {
  const writes = [];
  const c = boot('lang=tr&welcome=1', { clipboard: { writeText: async value => writes.push(value) } });
  c.location.href = c.location.href.replace('#guideApp', '#private-progress');
  c.choose('en'); c.node('copyGuideLink').emit('click'); await new Promise(setImmediate);
  assert.equal(new URL(writes[0]).hash, '');
  assert.equal(new URL(writes[0]).searchParams.get('lang'), 'en');
});

for (const lang of ['ka','tr','hy']) for (const location of Object.keys(targets)) test(`${lang}/${location}: text location choice persists, copies and opens the allowlisted target`, async () => {
  const writes = [];
  const c = boot(`lang=${lang}&welcome=1&secret=omit`, { clipboard: { writeText: async text => writes.push(text) } });
  c.node('locationSelect').value = location; c.node('locationSelect').emit('change');
  assert.equal(new URL(c.location.href).searchParams.get('location'), location);
  assert.equal(c.storage.get('cxDragonGuide:location'), location);
  assert.ok(c.node('speechText').textContent.length > 100);
  c.node('copyGuideLink').emit('click'); await new Promise(setImmediate);
  const copied = new URL(writes[0]);
  assert.equal(copied.searchParams.get('lang'), lang);
  assert.equal(copied.searchParams.get('location'), location);
  assert.equal(copied.searchParams.has('secret'), false);
  const restored = boot(`lang=${lang}&welcome=1`, { storage: Object.fromEntries(c.storage) });
  assert.equal(restored.node('locationSelect').value, '');
  assert.equal(restored.node('lastLocationPanel').hidden, false);
  restored.node('returnLocation').emit('click');
  assert.equal(restored.node('locationSelect').value, location);
  c.node('openButton').emit('click');
  const target = new URL(c.redirects[0]);
  assert.equal(target.pathname, '/' + targets[location] + '/');
  assert.equal(target.searchParams.get('lang'), lang);
  assert.equal(c.utterances.length, 0);
  assert.equal(c.node('guideAudio').loads || 0, 0);
});
for (const lang of ['ka','tr','hy']) test(`${lang}: only explicit English MP3; no new TTS; failure and completion retain manual text path`, async () => {
  const c = boot(`location=siechnice&lang=${lang}&welcome=1`, { speech: true, rejectAudio: true });
  c.node('startButton').emit('click'); await new Promise(setImmediate);
  assert.match(c.node('guideAudio').src, /intro-en\.mp3/);
  assert.equal(c.utterances.length, 0);
  assert.equal(c.node('openButton').hidden, false);
  assert.ok(c.node('audioStatus').textContent.length > 15);
  const ok = boot(`location=ryczywol&lang=${lang}&welcome=1`, { speech: true });
  ok.node('startButton').emit('click'); await new Promise(setImmediate);
  ok.node('guideAudio').emit('ended');
  assert.equal(ok.utterances.length, 0);
  assert.equal(ok.timers.filter(t => !t.cancelled).length, 0);
  assert.equal(ok.redirects.length, 0);
  assert.equal(ok.node('openButton').hidden, false);
});
for (const lang of ['ka','tr','hy']) test(`${lang}: invalid/corrupt location is rejected and localized`, () => {
  const c = boot(`lang=${lang}&location=https://bad.invalid`, { blocked: true });
  assert.equal(c.node('invalidState').hidden, false);
  assert.ok(c.node('invalidTitle').textContent.length > 5);
  c.node('openButton').emit('click'); assert.equal(c.redirects.length, 0);
  const safe = boot(`lang=${lang}&welcome=1`, { storage: { 'cxDragonGuide:location': '{bad', unrelated: 'keep' } });
  assert.equal(safe.node('locationSelect').value, '');
  assert.equal(safe.storage.get('unrelated'), 'keep');
  safe.node('locationSelect').value = 'https://bad.invalid';safe.node('locationSelect').emit('change');
  assert.equal(new URL(safe.location.href).searchParams.has('location'), false);
});

const allLocationLangs = [...locales, 'ka', 'tr', 'hy'];
for (const selectedLang of allLocationLangs) for (const target of Object.keys(targets)) test(`${selectedLang}/${target}: unified select return clear respects URL privacy and progress`, async () => {
  const key = 'cxDragonGuide:ryczywol:seen:20260717-location-copy';
  const writes = [];
  const c = boot(`lang=${selectedLang}&location=siechnice&private=secret&progress=99`, { storage: { 'cxDragonGuide:location': 'ryczywol', [key]: '1', unrelated: 'keep' }, clipboard: { writeText: async value => writes.push(value) } });
  assert.equal(c.node('locationSelect').value, 'siechnice', 'URL wins over saved last');
  assert.equal(c.node('lastLocationPanel').hidden, false);
  assert.ok(c.node('locationSelectLabel').textContent.length > 5);
  c.node('locationSelect').value = target;c.node('locationSelect').emit('change');
  assert.equal(c.node('locationSelect').value, target);
  assert.equal(c.storage.get('cxDragonGuide:location'), target);
  assert.equal(new URL(c.location.href).searchParams.has('private'), false);
  assert.equal(new URL(c.location.href).searchParams.has('progress'), false);
  c.node('copyGuideLink').emit('click');await new Promise(setImmediate);
  assert.equal(new URL(writes[0]).searchParams.get('lang'), selectedLang);
  assert.equal(new URL(writes[0]).searchParams.get('location'), target);
  c.node('locationSelect').value = '';c.node('locationSelect').emit('change');
  assert.equal(c.node('locationSelect').value, '');
  assert.equal(c.node('lastLocationPanel').hidden, false);
  c.node('returnLocation').emit('click');
  assert.equal(c.node('locationSelect').value, target);
  c.node('clearLocation').emit('click');
  assert.equal(c.node('lastLocationPanel').hidden, true);
  assert.equal(c.node('locationSelect').value, '');
  assert.equal(c.storage.has('cxDragonGuide:location'), false);
  assert.equal(c.storage.get(key), '1');assert.equal(c.storage.get('unrelated'), 'keep');
  assert.equal(c.document.activeElement, c.node('locationSelect'));
  assert.equal(new URL(c.node('guideLinkURL').value).searchParams.has('location'), false);
  assert.equal(c.node('guideAudio').loads || 0, 0);assert.equal(c.utterances.length, 0);assert.equal(c.redirects.length, 0);
});
for (const selectedLang of allLocationLangs) test(`${selectedLang}: stored last is explicit; invalid URL recovers; optional storage`, () => {
  const c = boot(`lang=${selectedLang}&welcome=1`, { storage: { 'cxDragonGuide:location': 'ryczywol' } });
  assert.equal(c.node('locationSelect').value, '');assert.equal(c.node('lastLocationPanel').hidden, false);
  c.node('returnLocation').emit('click');assert.equal(c.node('locationSelect').value, 'ryczywol');
  const bad = boot(`lang=${selectedLang}&location=unknown`, { blocked: true, blockedHistory: true });
  assert.equal(bad.node('invalidState').hidden, false);
  bad.node('locationSelect').value='siechnice';bad.node('locationSelect').emit('change');
  assert.equal(bad.node('guideApp').hidden, false);assert.equal(bad.node('invalidState').hidden, true);
  assert.equal(bad.node('locationSelect').value, 'siechnice');
  assert.ok(bad.node('locationChoiceStatus').textContent.length > 10);
  bad.node('locationSelect').value='';bad.node('locationSelect').emit('change');
  bad.node('returnLocation').emit('click');assert.equal(bad.node('locationSelect').value, 'siechnice');
  bad.node('clearLocation').emit('click');assert.equal(bad.node('lastLocationPanel').hidden, true);
  assert.equal(bad.redirects.length,0);
  const corrupt=boot(`lang=${selectedLang}`, { storage:{ 'cxDragonGuide:location':'https://evil.invalid/?private=x' } });
  assert.equal(corrupt.node('lastLocationPanel').hidden,true);assert.equal(corrupt.node('locationSelect').value,'');
});

test('late clipboard rejection after location clear cannot expose previous link', async () => {
 let reject;
 const c=boot('lang=en&location=siechnice&welcome=1',{clipboard:{writeText:()=>new Promise((_a,b)=>reject=b)}});
 c.node('copyGuideLink').emit('click');c.node('clearLocation').emit('click');reject(Error('late'));await new Promise(setImmediate);
 assert.equal(c.node('manualGuideLink').hidden,true);assert.equal(c.node('copyGuideStatus').textContent,'');
 assert.equal(new URL(c.node('guideLinkURL').value).searchParams.has('location'),false);
});
for (const reject of [false, true]) test(`clear invalidates late audio ${reject ? 'rejection' : 'success'} without clearing progress`, async () => {
 const c=boot('lang=en&welcome=1',{deferAudio:true,storage:{'cxDragonGuide:location':'ryczywol'}});
 c.node('startButton').emit('click');c.node('clearLocation').emit('click');
 const status=c.node('audioStatus').textContent;
 if(reject)c.playRequests[0].reject(Error('late'));else c.playRequests[0].resolve();
 await new Promise(setImmediate);
 assert.equal(c.node('audioStatus').textContent,status);
 assert.equal(c.node('pauseButton').hidden,true);assert.equal(c.redirects.length,0);
});
for (const lang of allLocationLangs) test(`${lang}: generic choice remembers departed URL location even after denied-storage reload`, () => {
 const c=boot(`lang=${lang}&location=ryczywol&welcome=1`,{blocked:true});
 assert.equal(c.node('lastLocationPanel').hidden,true);
 c.node('locationSelect').value='';c.node('locationSelect').emit('change');
 assert.equal(c.node('lastLocationPanel').hidden,false);
 assert.ok(c.node('locationChoiceStatus').textContent.length>10);
 c.node('returnLocation').emit('click');assert.equal(c.node('locationSelect').value,'ryczywol');
 assert.equal(c.redirects.length,0);assert.equal(c.node('guideAudio').loads||0,0);
});
