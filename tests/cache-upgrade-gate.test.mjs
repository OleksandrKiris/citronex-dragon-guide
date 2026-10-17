import test from 'node:test';
import assert from 'node:assert/strict';
import { headUpgradeReady } from '../.github/browser/cache-upgrade-gate.mjs';
const baseCache = 'citronex-dragon-guide-20261017-media-retry1';
const headCache = 'citronex-dragon-guide-20261017-tr-fallback1';
const state = { baseCache, headCache, keys: [headCache], controllerChanged: true, activated: true };
test('old gate accepts BASE-only cache; HEAD gate rejects the same state', () => {
  const keys = [baseCache];
  assert.equal(keys.includes(baseCache) && !keys.includes('citronex-dragon-guide-20261016-primserv-guide5'), true);
  assert.equal(headUpgradeReady({ ...state, keys, controllerChanged: false }), false);
});
test('HEAD cache alone cannot prove controller activation', () => {
  assert.equal(headUpgradeReady({ ...state, controllerChanged: false }), false);
  assert.equal(headUpgradeReady({ ...state, activated: false }), false);
});
test('retained BASE cache or equal versions cannot pass HEAD gate', () => {
  assert.equal(headUpgradeReady({ ...state, keys: [baseCache, headCache] }), false);
  assert.equal(headUpgradeReady({ ...state, baseCache: headCache }), false);
});
test('changed activated controller and HEAD cache without BASE satisfy gate', () => {
  assert.equal(headUpgradeReady(state), true);
});
