# Role4 public guide link — scope before implementation

Owner: role4 / OleksandrKiris/citronex-dragon-guide.
Accepted upstream base: 3a7ea5e0b70abece336f41c00c31cf510928aaeb;
full tree06626cf3318316c2d944e99c677aca96aecededb.
Fresh open PR list empty; existing clipboard action not found in own source.
Local text snapshot inherited from accepted PR9; binaries absent locally, preserved by inherited remote full tree.
One branch: codex/guide-copy-public-link-20261017. Dependencies: none.

Allowed paths: index.html, assets/guide.js, sw.js (cache/version),
tests/guide.test.mjs, tests/service-worker.test.mjs (version expectations),
.github/browser/guide.mjs (existing CI acceptance), this journal.
No workflows/dependencies/shared-repository files/audio/materials/progress changes.

Public URL uses fixed canonical guide origin/path; requested ka/tr/hy retained
for automatic fallback, explicit supported-language choice wins. Only known
location, welcome=1 and optional existing #guideApp anchor. No private/unrelated
query/hash/progress. Clipboard success/rejection/unavailable; failure exposes
labelled readonly selectable URL with manual instructions. Stale promise results
must not overwrite newer language/action state. No send or navigation action.

Planned evidence: negative URL and clipboard lifecycle unit tests;320/1280
keyboard, auto/manual language, reload/Back, three clipboard outcomes and pending
language change through existing CI. Previous real worker upgrade retained.
Function prepared only after tests; contract unchanged; review/publication role10.
