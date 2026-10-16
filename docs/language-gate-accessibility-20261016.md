# First-entry language choice — 16 October 2026

Base: `a6e0219afac7089d82087daf3c4ccbaae0d6388a` (speech control fixes from PR #5 included).

Confirmed defects: the custom modal only focused its first button, allowing Tab to leave the dialog for background controls; closing it left focus on a hidden language button. The language select's accessible label stayed Polish after language changes.

The dialog now makes sibling content inert while open, cycles Tab/Shift+Tab at its boundaries, and focuses the detected language. Escape accepts the already selected language and closes the choice. Choosing a language or pressing Escape returns focus to the visible start button, without starting audio or navigating. Original inert states are restored on close. The language select reuses the existing translated language-choice label for all nine supported languages; no new instruction translations were introduced.

Validation: 109 Node tests, including 13 added first-entry/accessible-label cases, JavaScript syntax checks and `git diff --check`. Regression cases were run before the fix to demonstrate failures. Existing tests retain checks for speech/audio events, blocked storage, all city/language destinations, original instruction content and MP3 paths, direct service links, offline fallback and cache isolation. This repository has no package.json/npm test. No real forms, messages, calls or bookings were sent.

The browser connection timed out, so the keyboard/focus checks are isolated DOM tests, not a real desktop/mobile visual or screen-reader audit. No layout/CSS changes, dependencies, remote requests, audio files, photographs or operational content were added or removed.

JS/cache version: `20261016-primserv-guide4`. Rollback: revert the PR, advance the cache version, and repeat the same checks before publishing.
