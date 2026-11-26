export default {
 async fetch(request, env) {
 if (!env.PYTH_API_KEY) return Response.json({connected:false,error:"Missing PYTH_API_KEY"});
 try {
 const now=Math.floor(Date.now()/1000);
 const url=new URL("https://pyth.dourolabs.app/v1/fixed_rate@1000ms/history");
 for(const [k,v] of Object.entries({symbol:"Crypto.HYPE/USD",resolution:"1",from:now-3600,to:now})) url.searchParams.set(k,String(v));
 const r=await fetch(url,{headers:{Authorization:"Bearer "+env.PYTH_API_KEY}});
 const d=await r.json();
 const connected=r.ok&&d.s==="ok"&&Array.isArray(d.c)&&d.c.length>0;
 return Response.json({app:"CORY HYPE TURBO",connected,status:r.status,feedStatus:d.s??null,price:connected?Number(d.c.at(-1)).toFixed(4):null,candles:connected?d.c.length:0,lastTimestamp:connected?d.t?.at(-1):null},{headers:{"Cache-Control":"no-store"}});
 }catch{return Response.json({connected:false,error:"Pyth request failed"},{status:502});}
 }
};