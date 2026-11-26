export default {async fetch(request,env){
const reply=d=>Response.json({app:"CORY HYPE TURBO",version:3,...d},{headers:{"Cache-Control":"no-store"}});
let key=String(env.PYTH_API_KEY||"").trim().replace(/^Bearer\s+/i,"");
if(!key||/\s/.test(key)||/[^\x21-\x7e]/.test(key))return reply({connected:false,error:"Secret must contain only the raw API key"});
const base="https://pyth.dourolabs.app/v1";
async function probe(path,auth=false){try{const r=await fetch(base+path,{headers:auth?{Authorization:"Bearer "+key}:{},redirect:"manual",signal:AbortSignal.timeout(8000)});let d;try{d=await r.json()}catch{}return {status:r.status,data:d};}catch(e){return {error:e.name==="TimeoutError"?"Timeout": "Transport failure"};}}
const now=Math.floor(Date.now()/1000);
const q="?symbol=Crypto.HYPE%2FUSD&resolution=1&from="+(now-3600)+"&to="+now;
const channels=["fixed_rate@1000ms","fixed_rate@200ms","real_time"];
const results=await Promise.all([probe("/live"),...channels.map(c=>probe("/"+c+"/history"+q,true))]);
const checks=channels.map((c,i)=>{const r=results[i+1],d=r.data;const ok=r.status===200&&d?.s==="ok"&&Array.isArray(d.c)&&d.c.length>0;return {channel:c,status:r.status??null,error:r.error??null,connected:ok,price:ok?Number(d.c.at(-1)).toFixed(4):null,lastTimestamp:ok?d.t?.at(-1):null};});
return reply({connected:checks.some(c=>c.connected),health:results[0].status??results[0].error,checks});
}};