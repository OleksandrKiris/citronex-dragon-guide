# PR8 — real-browser acceptance in GitHub Actions

This continues the existing media-error retry, not a second feature. The user
authorized Chromium/Playwright in existing GitHub Actions after managed preview
was unavailable. The local extension still reports originating browser context.
No local browser launcher, preview bypass, production deployment or new service
is introduced. Runtime/audio/instruction changes remain exactly those of PR8.

The existing PR workflow runs the 131 project tests, then pinned Playwright 1.56.1
in runner temporary storage. `.github/browser/guide.mjs` refuses non-Actions runs.
Its short-lived localhost HTTP server serves exact checked-out bytes under the
production path; hashes are compared to TESTED_HEAD before Chromium launches.
Base files come from TESTED_BASE for a real service-worker upgrade on the same
origin. The runner shuts down the server/browser and retains JSON, screenshots
and traces for seven days, including on failure. Exact head/base/run/artifact
and the final result are recorded in the PR; adding this harness alone is NOT
proof of passing acceptance. Draft remains until the report/screenshots pass.

Scenarios: 1280×900 and 320×900; Tab/Enter Start, Pause, Resume, Replay; actual
browser offline before the first MP3 request, repeated failure with readable
text, online restoration and explicit retry of the existing English recording;
nine UI languages, ka→EN notice, language persistence and offline reload; Back
from an explicitly intercepted external destination; corrupt/denied storage;
actual old→new service-worker activation, language/seen/unrelated data retained,
then offline reload. No media mocks/synthetic error events stand in for the
network-loss scenario. Offline disables browser networking AND stops the actual
local HTTP listener (restored on the same port for recovery). The first run
showed that Chromium's offline emulation alone still allowed SW-owned requests;
that run failed and is not counted as offline evidence. Stopping the origin
ensures no uncached resource is reachable, without mocking MediaError or audio.
Only one existing audio file is requested per scenario;
other languages are UI checks, not claims of listening to all recordings.

First use requires successful HTTP/HTTPS loading. The test proves only cached
shell/text offline; it does not promise all audio offline, OS speech voices,
never-opened devices, external sites or service workers on file://. A cache
upgrade can discard old audio under the existing policy; no policy is changed.
The script records actual requests and new cache entries/bytes. It blocks
non-GET/HEAD requests and external resources. External navigation fixtures test
return context, not live third-party functionality. Viewport emulation is not
a physical phone or screen-reader audit. Browser decoding is not a human audit
of recording content or audibility.

Production delta of this acceptance follow-up: zero runtime bytes and zero new
runtime dependencies/requests/cache entries. Tooling is CI-only. Last published
base remains 3cea7654917c19a076bf1fe97bb75f3cdb3f9f7d; PR8 runtime delta is +164 B,
cache/JS version 20261017-media-retry1, with seven core precache assets and no
audio preload. Full rollback requirements remain in media-retry-20261017.md:
separate verified revert PR, fresh cache version, fresh head/base tests; no
reset/force-push, removal of saved data, or overriding newer work. Only owner10
can merge/release. No merge/deploy is performed by this PR author.
