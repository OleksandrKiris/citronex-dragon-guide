# Role4 / issue kiris-jobs#41: text path ka/tr/hy

Scope recorded before implementation. Owner4: OleksandrKiris/citronex-dragon-guide.
Base70b0f74e95d1556c85aa649d6204b106bd564c4f, full tree18b4d00e48d996dea4f39df61c764dc67cd8dd33.
Fresh main verified; no open PR; prior PR10 released. One branch/WIP only:
codex/guide-ka-tr-hy-text-path-20261017.
Allowed: index.html, assets/guide.js, sw.js, tests/guide.test.mjs,
tests/service-worker.test.mjs, .github/browser/guide.mjs, this journal.
No dependencies/workflows/other repositories/audio assets/backend changes.

User path: choose ka/tr/hy; read local welcome/three steps and location text;
select existing location, persist it in URL and optional storage; open existing
training target or copy sanitized guide URL retaining selected language.
New text is a local draft translation of existing guide facts, not native-reviewed.
Existing Reader/Tablet names, locations/material IDs/progress BUILD remain.
Existing English intro MP3 only on explicit user action with localized English-audio
notice; no generated audio or new-language TTS, no auto-start/auto-navigation.
External pages may have partial translations; local warning, no promise that
all target training materials are translated. Existing9-language behavior retained.

Checks planned: previous regressions plus text/UI/error/copy/language/location,
blocked/corrupt storage, reload/Back,320/1280/keyboard, no unsolicited media/TTS;
existing exact CI/BASE-to-HEAD/offline proof. One current handoff with exact
base/head/tree/runtime hashes, counts/bytes and bounded audio/translation evidence.
Function prepared != independently accepted != published. Role10 alone releases.

## Prepared implementation / evidence map

Text capabilities extend LANGS only AFTER the original AUDIO map is built.
All source before BUILD and nine original MP3 paths remain byte-for-byte;
no ka/tr/hy MP3 path or speech synthesis call is introduced. Explicit Start/Replay
uses existing AUDIO.en for these3 languages, and failure is localized text only.
Completion does not auto-redirect. Existing pause/replay retained.

Draft copy is inline/local: generic intro, three existing location descriptions,
three steps, controls/copy/errors/service labels/English-audio notice/partial-target
translation notice. New facts/addresses/conditions absent. Not native-reviewed.
Location selection is allowlisted and writes URL plus optional location preference;
public-copy is still fixed-origin with no unrelated/private query/hash/progress.
Manual language changes and late-clipboard guards remain.

Red/green:15 new targeted tests fail on accepted base runtime,15 pass on changed
runtime. Full local167:166 pass, only accepted PNG ENOENT in text-only copy;
no assertion skip or fake binary. Syntax/diff checks pass. Exact CI must use full
checkout and PNG/hash.18 new text-path browser cases planned through existing
helper (3 languages ×2 widths ×clean/corrupt/denied storage), all3 locations,
keyboard language/open/copy, reload/Back/offline and explicit EN failure fixture.
Existing audio9/public-copy8/actual BASE→HEAD offline gate retained with assertions
updated from superseded English-fallback behavior to selected-language text.
No local substitute browser/audio execution. Current authoritative head/CI/hash
handoff will be the single PR description. Not accepted or published.
