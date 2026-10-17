# Role4: explicit Turkish link fallback — local WIP

Repository: OleksandrKiris/citronex-dragon-guide.
Upstream tested_base: 79fdd78cde1d3f46e1e8d9e17b6178a3e13a2d9a.
Existing WIP branch: feat/guide-text-ka-tr-hy-20261017. No new remote branch/PR.
Local snapshot is text-only; its commit is not an upstream commit.

Allowed local slice: assets/guide.js, index.html (JS cache URL), sw.js (cache
version only), tests/guide.test.mjs, tests/service-worker.test.mjs and this log.
No dependencies, workflows, audio, source materials, completion BUILD or IDs changed.

## Result map

- Works: nine existing audio language paths and existing text are unchanged;
  explicit ka/hy fallback and uk alias continue to work in VM tests.
- Confirmed defect: ?lang=tr with saved Polish selected Polish without a
  fallback notice, unlike explicit ka/hy. Two new Turkish tests fail on base.
- Prepared: explicit tr now selects English, labels Türkçe → English (EN),
  and does not autoplay/load audio or redirect. Changing language hides notice.
- Gap: native ka/tr/hy translations remain unavailable; this is honest fallback,
  not a reconstruction or replacement of the missing translation archive.
- Next: restore full binary checkout, run all 135 checks and exact-head browser
  acceptance, then role10 reviews integration into the same WIP.

## Evidence and limitations

Four new tests: base 2 pass/2 fail; changed code 4 pass/0 fail.
Full suite: 135 total, 134 pass, 1 fails with ENOENT for unchanged
assets/brand/primserv-icon-192.png. Binary omitted in local copy; NOT a product bug.
No fake PNG, skipped assertion, or relaxed hash check. Existing cache assertions
updated to retain current cache and remove previous cache; seven core assets and
on-demand audio policy unchanged. node --check guide.js/sw.js and diff --check pass.
No browser UI, actual playback or actual offline test performed in this turn.
No new server, account, online adapter, paid request or candidate data.

## Blocker / status

Function: local prepared patch, limited checks above. Contract: unchanged.
Acceptance/publication: not accepted, not published; role10 owns merge/deploy.
Earlier GitHub write block is reported in prior context, but its exact denied
operation/reason cannot be recovered: Personal Context returned unavailable.
No GitHub write was attempted or routed around that restriction this turn.
The old archive is unavailable; repeated archive search was not performed.
No other active run is evidenced in available context; no exclusivity guarantee.
Schedules unchanged. Remote main was rechecked as tested_base before editing.
