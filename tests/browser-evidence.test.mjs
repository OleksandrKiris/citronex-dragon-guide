import test from 'node:test';
import assert from 'node:assert/strict';
import { finishEvidence, selectUpgradeBase, workerCacheName } from '../.github/browser/evidence-retention.mjs';
function fixture({ failed=false, traceError=-1, closeError='', writeError=false }={}) {
 const calls=[];
 const contexts=Array.from({length:3},(_,index)=>({tracing:{async stop(options){calls.push(['trace',index,options?.path]);if(index===traceError)throw Error('trace failed');}}}));
 const report={pass:!failed,...(failed?{failure:'original scenario assertion'}:{})};
 const options={contexts,activeContext:contexts[0],representativeContext:contexts[2],reportDir:'/evidence',report,
  async closeBrowser(){calls.push(['browser']);if(closeError==='browser')throw Error('browser failed');},
  async closeServer(){calls.push(['server']);if(closeError==='server')throw Error('server failed');},
  async writeReport(value){calls.push(['report',structuredClone(value)]);if(writeError)throw Error('write failed');}};
 return {calls,report,options};
}
test('success keeps one actual upgrade trace and discards redundant successful outputs',async()=>{
 const f=fixture();await finishEvidence(f.options);
 assert.equal(f.report.pass,true);assert.equal(f.calls[0][2],undefined);assert.equal(f.calls[1][2],undefined);
 assert.match(f.calls[2][2],/worker-upgrade-trace-2\.zip$/);
 assert.equal(f.report.traceRetention.kept.length,1);assert.equal(f.report.traceRetention.discarded.length,2);
});
test('scenario failure keeps active failure trace plus distinct representative and JSON',async()=>{
 const f=fixture({failed:true});await finishEvidence(f.options);
 assert.match(f.calls[0][2],/failure-trace-0\.zip$/);assert.equal(f.calls[1][2],undefined);
 assert.match(f.calls[2][2],/worker-upgrade-trace-2\.zip$/);assert.equal(f.calls.at(-1)[0],'report');
 assert.equal(f.report.failure,'original scenario assertion');assert.equal(f.report.pass,false);
});
test('trace stop error is non-success and cannot prevent other traces or cleanup/JSON',async()=>{
 const f=fixture({traceError:1});await finishEvidence(f.options);
 assert.deepEqual(f.calls.map(c=>c[0]),['trace','trace','trace','browser','server','report']);
 assert.equal(f.report.pass,false);assert.equal(f.report.traceRetention.errors[0].stage,'trace:1');
 assert.equal(f.calls.at(-1)[1].pass,false);
});
for(const closeError of ['browser','server'])test(`${closeError} close failure still attempts remaining cleanup and failure JSON`,async()=>{
 const f=fixture({closeError});await finishEvidence(f.options);
 assert.deepEqual(f.calls.slice(-3).map(c=>c[0]),['browser','server','report']);
 assert.equal(f.report.pass,false);assert.equal(f.calls.at(-1)[1].pass,false);
 assert.equal(f.report.traceRetention.errors[0].stage,closeError+'-close');
});
test('report write failure returns explicit unwritten failure for nonzero console fallback',async()=>{
 const f=fixture({writeError:true});const result=await finishEvidence(f.options);
 assert.equal(result.written,false);assert.equal(f.report.pass,false);
 assert.equal(f.report.traceRetention.errors.at(-1).stage,'report-write');
 assert.match(JSON.stringify(f.report),/write failed/);
});
test('cleanup failure preserves original scenario assertion instead of replacing it',async()=>{
 const f=fixture({failed:true,traceError:0});await finishEvidence(f.options);
 assert.equal(f.report.failure,'original scenario assertion');assert.equal(f.report.traceRetention.errors[0].stage,'trace:0');
});
const worker=version=>`const CACHE_NAME = CACHE_PREFIX + "${version}";`;
test('harness-only base equals HEAD: select nearest different accepted worker, not current base',()=>{
 const read=sha=>worker({base:'head',prior:'old',older:'older'}[sha]);
 assert.equal(selectUpgradeBase(['base','prior','older'],read,workerCacheName(worker('head'))),'prior');
});
test('runtime-changing base remains upgrade source without walking older history',()=>{
 const reads=[];assert.equal(selectUpgradeBase(['base','older'],sha=>{reads.push(sha);return worker('old');},workerCacheName(worker('head'))),'base');
 assert.deepEqual(reads,['base']);
});
test('absent version transition fails closed; malformed worker cannot silently skip',()=>{
 assert.throws(()=>selectUpgradeBase(['base'],()=>worker('head'),workerCacheName(worker('head'))),/No accepted/);
 assert.throws(()=>selectUpgradeBase(['base'],()=>'',workerCacheName(worker('head'))),/Versioned/);
});
