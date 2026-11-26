export default {
 async fetch(request, env) {
 const reply=(data)=>Response.json({app:"CORY HYPE TURBO",version:2,...data},{headers:{"Cache-Control":"no-store"}});
 if(!env.PYTH_API_KEY)return reply({connected:false,error:"Missing PYTH_API_KEY"});
 const now=Math.floor(Date.now()/1000);
 const url=new URL("https://pyth.dourolabs.app/v1/fixed_rate@1000ms/history");
 for(const [k,v] of Object.entries({symbol:"Crypto.HYPE/USD",resolution:"1",from:now-3600,to:now}))url.searchParams.set(k,String(v));
 let r;
 try{r=await fetch(url,{headers:{Authorization:"Bearer "+env.PYTH_API_KEY},redirect:"manual"});}catch{return reply({connected:false,error:"Network request failed"});}
 const status=r.status;
 let d;
 try{d=await r.json();}catch{return reply({connected:false,status,error:"Non-JSON response",contentType:r.headers.get("content-type")});}
 const connected=r.ok&&d.s==="ok"&&Array.isArray(d.c)&&d.c.length>0;
 return reply({connected,status,feedStatus:["ok","no_data","error"].includes(d.s)?d.s:null,price:connected?Number(d.c.at(-1)).toFixed(4):null,candles:connected?d.c.length:0,lastTimestamp:connected?d.t?.at(-1):null,error:connected?null:"Feed unavailable or unexpected response"});
 }
};