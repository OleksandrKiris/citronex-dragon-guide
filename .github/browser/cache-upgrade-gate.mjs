export function headUpgradeReady({ keys, baseCache, headCache, controllerChanged, activated }) {
  return baseCache !== headCache && controllerChanged && activated &&
    keys.includes(headCache) && !keys.includes(baseCache);
}
