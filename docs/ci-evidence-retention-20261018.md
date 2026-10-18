# Role4: bound successful browser traces; preserve failure evidence

Scope before code. Owner4 / OleksandrKiris/citronex-dragon-guide.
Fresh mainf51c280d90697cd3ad2d9e0623dedc020fa2073d;
full tree8ef8b3320590276b7cc5f9ab911e9520abecccdb; no open PR.
Prior PR12 released. One branch codex/guide-ci-evidence-retention-20261018.
Root evidence: old artifact12118170261 is1,007,892,499B; successful traces
991,172,664B compressed (~98.3%). Do not download another copy.

Allowed paths: .github/browser/guide.mjs; .github/browser/evidence-retention.mjs
(small pure helper for retention/cleanup/upgrade-baseline selection);
tests/browser-evidence.test.mjs; this journal. No public runtime8/binary11,
translations/facts/SWversion/workflow/dependency/API/AI changes.

Keep all230 existing unit checks/53 browser scenarios/assertions/screenshots,
required JSON/hashes/request/cache rows and actual BASE→HEAD/offline checks.
Discard successful redundant trace outputs; retain one representative actual
worker-upgrade trace and active failure trace. Trace/close errors must be recorded,
all cleanup attempted, required JSON attempted, nonzero result on any error.
No swallowing failures or local browser/CI-guard spoof.

Harness-only PR has equal public SW at PR base/head. Keep tested_base=f51;
explicitly record separate upgradeBase: nearest first-parent accepted ancestor
with a different cache version, without editing runtime or weakening gate. If no
such base exists, fail. Representative trace records that real transition.

Meaningful red/green via injected trace/cleanup/report failures and BASE-equality
selection; one ordinary full CI, exact artifact size/digest versus old metadata.
Author does not download old1GB; one current artifact reserved for runtimehelper.
Role2 independent retention criteria, role10 alone merge/deploy. No delegation to
prohibited thread01a14a88-a7ff-76a2-b677-8363218434dc. No automation changes.

## Prepared evidence / retention error policy

Ten lightweight fault-injection/retention tests: legacy-policy adapter reproducing
accepted finally (save every trace, swallow stop errors, sequential cleanup) passes
1/10 and fails9/10; new helper10/10. This is a policy/cleanup adapter test, NOT a
claim of executing a browser against old code. Covered: success one trace, failure
active+representative, stop/browser/server/report errors, original failure retention,
equal/different SW base and fail-closed missing/malformed upgrade history.
Full local240:239 pass, unchanged PNG ENOENT in text-only copy only. Syntax/diff pass.
All230 pre-existing tests and53 browser assertions/scenarios remain enabled.

Trace errors mark report.pass=false and are included in JSON. Cleanup continues
through browser/server closure and required report write. JSON-write failure is
explicitly returned; caller exits nonzero and prints full failure JSON to stderr
(the filesystem cannot promise a saved JSON if its write itself fails). A failure
before any browser context exists cannot create a trace, and is reported as such.
No failure path is converted into success. Unchanged screenshots/report/hashes
and one actual worker-upgrade trace are retained. No current/old artifact downloaded.

PR source base remains f51. Because public SW is byte-identical, upgradeBase is
explicit nearest first-parent ancestor with a different parsed SW cache version;
expected95ba. Real controller/cache/offline assertions unchanged, no runtime bump.
Current exact head/fulltree/CI/artifact size and upload digest will be in one PR
handoff; independent download/PNG verification belongs to runtimehelper, not author.
