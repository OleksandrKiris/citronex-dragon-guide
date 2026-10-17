import { join } from 'node:path';

export function workerCacheName(bytes) {
  const match = bytes.toString().match(/const CACHE_NAME = CACHE_PREFIX \+ "([^"]+)"/);
  if (!match) throw Error('Versioned guide cache must be explicit');
  return 'citronex-dragon-guide-' + match[1];
}

export function selectUpgradeBase(candidates, readWorker, headCache) {
  for (const sha of candidates) if (workerCacheName(readWorker(sha)) !== headCache) return sha;
  throw Error('No accepted first-parent ancestor has a different SW cache version');
}

// Thin cleanup wrapper: retain failures/one real upgrade, discard redundant success traces.
export async function finishEvidence({ contexts, activeContext, representativeContext, reportDir,
  report, closeBrowser, closeServer, writeReport }) {
  const retention = report.traceRetention = { kept: [], discarded: [], errors: [] };
  const recordError = (stage, error) => {
    const detail = error?.stack || String(error);
    retention.errors.push({ stage, detail });
    report.pass = false;
    report.failure ||= detail;
  };
  if (report.pass && !contexts.includes(representativeContext)) recordError('representative', Error('Successful run requires the actual worker-upgrade context'));
  for (const [index, ctx] of contexts.entries()) {
    const failure = !report.pass && ctx === activeContext;
    const representative = ctx === representativeContext;
    const name = failure ? `failure-trace-${index}.zip` : `worker-upgrade-trace-${index}.zip`;
    try {
      if (failure || representative) {
        await ctx.tracing.stop({ path: join(reportDir, name) });
        retention.kept.push({ index, file: name, failure, representative });
      } else {
        await ctx.tracing.stop();
        retention.discarded.push(index);
      }
    } catch (error) { recordError(`trace:${index}`, error); }
  }
  try { await closeBrowser(); } catch (error) { recordError('browser-close', error); }
  try { await closeServer(); } catch (error) { recordError('server-close', error); }
  report.finished = new Date().toISOString();
  try { await writeReport(report); return { written: true }; }
  catch (error) { recordError('report-write', error); return { written: false }; }
}
