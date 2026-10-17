# Role4: unified location choice / return / clear

Scope before code. Repo OleksandrKiris/citronex-dragon-guide, owner4.
Fresh accepted base95ba121c42e82582a9efdff0d4b4b38e577e7840,
full tree6fc651d0aae2049678210f8208cff12d0332d77b; no open PR.
Gap confirmed: textPathControls hidden for old9; locationSelect change returns
unless textOnlyLanguage(); no shared return/clear action. Not a duplicate.
One branch codex/guide-location-path-all-languages-20261018.
Allowed paths: index.html, assets/guide.js, sw.js, tests/guide.test.mjs,
tests/service-worker.test.mjs, .github/browser/guide.mjs, this journal.
No workflows/dependencies/other repositories/material/audio changes.

All12 use selector, explicit return-to-last and clear. Only3 accepted TARGETS IDs.
URL is current choice and has priority. Saved last location is offered explicitly,
not silently substituted into generic URL. Previously-seen flags remain stored,
but opening a guide no longer immediately redirects past selection controls.
Explicit selection/return rewrites only public lang/location/welcome and allowed
#guideApp; generic clears location and retains last-return option. Clear removes
only location preference, current selection and copy state, not language/seen/
unrelated storage. Denied/corrupt storage cannot block in-memory controls.

Existing12 languages/ka-tr-hy text and English-intro notice, original9 audio
paths/pause/replay, clean public-copy, existing facts/IDs/BUILD remain unchanged.
No new MP3/TTS/API/AI/address/condition. Automatic guide opening does not play
or navigate. Completion of explicitly requested old audio retains prior behavior.

Plan: meaningful baseline red/new green; all12 ×3 choices, return/clear,
optional storage/privacy/progress; own existing CI with320/1280 keyboard,
reload/Back/offline and exact HEAD worker upgrade. One current handoff/PR.
Function prepared != accepted != published. Role2 independent criteria;
role10 alone merge/deploy. No delegation to prohibited thread01a14a88-a7ff-76a2-b677-8363218434dc.

## Prepared evidence and semantics

49 targeted tests: baseline95ba runtime0/49, changed runtime49/49.
Full local218:217 pass; one unchanged PNG ENOENT in text-only checkout.
No fake asset/skips; complete CI must validate accepted PNG/hash.
Syntax/diff checks pass. Last-location key remains cxDragonGuide:location;
only a validated ID is stored; explicit clear removes just that key. Storage
failure is disclosed locally in all12 languages. Clear focuses the selector.
Location action invalidates old clipboard/audio callbacks and strips unrelated
query/hash from own URL; clean public-copy contract remains.

Intentional workflow change: saved location is now offered by an explicit return
button for all12, rather than silently applied only for3. Direct URL always wins;
generic link stays generic. Seen flags are preserved but do not trigger immediate
initial navigation past controls. No new business fact or destination.

Browser plan in existing helper:18 old9 cases (9×320/1280) with all3 locations,
return/clear, URL privacy/progress, keyboard/reload/Back/offline/no audio. Existing
18 text-language/storage cases also assert return/clear. Prior actual worker
upgrade and all audio/public-copy cases retained. No workflow/dependency changes.
Current exact head/base/hash/CI handoff is the single PR description; independent
role2 acceptance and role10 release remain separate. No new native-review claim.

## First exact CI finding / correction

CI39077476347 at2ad7fbf:218/218 unit,18 completed browser cases, then ka1280
storage-denied return assertion failed (guide.mjs332). After actual reload with
storage denied, current URL still names a site, but in-memory last was empty.
The strict assertion is retained. Generic choice now captures the valid departing
current URL location as last, attempts optional storage and discloses memory-only
status when denied. No persistence across reload is promised under denial.
Twelve new regressions (all12 languages): first-head0/12 -> changed12/12.
Full local230:229 pass, unchanged PNG ENOENT only. Next CI must be exact new head;
no blind rerun. Actual previous failure/evidence remains historical.
