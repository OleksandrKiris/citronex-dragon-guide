# Guide speech controls — 16 October 2026

Base: `cbc9d45a1d649b010ecbf32c05e8e7d45999684a`.

Confirmed defects:

- Location-specific browser speech hid the pause button at startup and never revealed it when speaking began. Nine language cases plus the generic guide's audio-failure fallback reproduced the missing controls before the fix.
- Pausing speech and requesting replay retained the engine's paused state, so replacement speech could stay silent. The same problem affected a new start after changing language while paused. The [Web Speech specification](https://webaudio.github.io/web-speech-api/#dom-speechsynthesis-cancel) confirms that cancel clears the queue without clearing pause.
- Speech pause/resume changed only the button caption, leaving the visible speaking status and animation inaccurate.

The existing controls now appear when speech starts. Button actions and native speech events update the caption, status and animation consistently. Explicit replay/new start releases the paused engine after the old queue is cancelled. Late events from obsolete speech remain ignored. Language selection alone never starts audio.

Validation: 96 Node tests, including 13 new regression cases; JavaScript syntax and diff checks. Existing tests verify original spoken content/MP3 paths, nine languages, location destinations, service links, blocked storage, fallback and cache behaviour. No package.json/npm test exists in this repository. No real messages, applications, calls or audio were sent/played. Browser connection was unavailable; these are code/HTTP checks, not a desktop or phone visual pass.

Cache/JS URL: `20261016-primserv-guide3`; CSS, branding, all MP3 files and instruction content remain unchanged. No additional requests or dependencies. Rollback: revert the PR, advance the cache version again and rerun the same tests before publishing.
