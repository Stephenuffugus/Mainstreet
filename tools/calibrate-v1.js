function cyrb128(s){let h1=1779033703,h2=3144134277,h3=1013904242,h4=2773480762;for(let i=0,k;i<s.length;i++){k=s.charCodeAt(i);h1=h2^Math.imul(h1^k,597399067);h2=h3^Math.imul(h2^k,2869860233);h3=h4^Math.imul(h3^k,951274213);h4=h1^Math.imul(h4^k,2716044179);}h1=Math.imul(h3^(h1>>>18),597399067);h2=Math.imul(h4^(h2>>>22),2869860233);h3=Math.imul(h1^(h3>>>17),951274213);h4=Math.imul(h2^(h4>>>19),2716044179);return[(h1^h2^h3^h4)>>>0,(h2^h1)>>>0,(h3^h1)>>>0,(h4^h1)>>>0];}
function sfc32(a,b,c,d){return function(){a|=0;b|=0;c|=0;d|=0;let t=(a+b|0)+d|0;d=d+1|0;a=b^b>>>9;b=c+(c<<3)|0;c=c<<21|c>>>11;c=c+t|0;return(t>>>0)/4294967296;}}
const gauss=r=>(r()+r()+r()+r()+r()+r()-3)*1.4142135623730951;
const A=[['LEMN',.05,.28,.02,.40,.40,0],['BAKE',.045,.14,.035,.45,.35,0],['TOYS',.06,.24,.015,.55,.40,1],['BIKE',.055,.20,.025,.50,.35,2],['PETS',.05,.16,.025,.40,.30,3],['BOTS',.09,.36,0,.55,.35,4]];
const T=240,dt=1/12,sdt=Math.sqrt(dt);
const P=[[0,.010,.005],[.025,0,.004],[.07,.03,0]];P.forEach((r,i)=>r[i]=1-r.reduce((a,b)=>a+b,0));
let pi=[1,0,0];for(let k=0;k<5000;k++)pi=[0,1,2].map(j=>pi.reduce((s,p,i)=>s+p*P[i][j],0));
const MB=.06,MS=-.20,MN=-(pi[1]*MB+pi[2]*MS)/pi[0],M=[MN,MB,MS],V=[1,.8,1.5];
function market(seed){const r=sfc32(...cyrb128(seed));const tr=A.map(()=>[1]);let reg=0,regs=[0],inf=[1],fad=[1],F=1,H=0;
 for(let t=1;t<=T;t++){const u=r();let acc=0;for(let j=0;j<3;j++){acc+=P[reg][j];if(u<acc){reg=j;break;}}regs.push(reg);
  const zm=gauss(r),zs=[gauss(r),gauss(r),gauss(r),gauss(r),gauss(r)];
  for(let i=0;i<6;i++){const[,mu,sg,dv,a,b,sec]=A[i];const c=Math.sqrt(1-a*a-b*b),sv=sg*V[reg];const z=a*zm+b*zs[sec]+c*gauss(r);
   const g=Math.max(-.6,(mu+dv+M[reg]*a/.5)*dt+sv*sdt*z);tr[i].push(tr[i][t-1]*(1+g));}
  F*=1-.03*dt; if(r()<.02)H+=.5+.4*r(); H+=-1.2*H*dt+.35*sdt*gauss(r); fad.push(F*Math.exp(H));
  inf.push(inf[t-1]*(1+(.025+[0,.01,-.01][reg])*dt+.003*sdt*gauss(r)));}
 return{tr,regs,inf,fad};}
function idxPath(m,fee){const p=[1];for(let t=1;t<=T;t++){let g=0;for(let i=0;i<6;i++)g+=(m.tr[i][t]/m.tr[i][t-1]-1)/6;p.push(p[t-1]*(1+g)*(1-fee*dt));}return p;}
const N=10000,R={town:[],pro:[],pick1:[],pick2:[],panic:[],fadchase:[],piggy:[]};let dd=[],sl=0;
for(let g=0;g<N;g++){const m=market('CS1|'+g),inf=m.inf[T],ip=idxPath(m,.002);R.town.push(ip[T]/inf);
 // pro picker: 1.5% fee, holds 2 random stocks switched yearly (uses separate rng)
 {const r=sfc32(...cyrb128('pro'+g));let v=1,h=[0,1];for(let t=1;t<=T;t++){if(t%12==1)h=[Math.floor(r()*6),Math.floor(r()*6)];let gg=0;for(const i of h)gg+=(m.tr[i][t]/m.tr[i][t-1]-1)/2;v*=(1+gg)*(1-.015*dt);}R.pro.push(v/inf);}
 R.pick1.push(m.tr[g%6][T]/inf);const k2=(g*7+3)%6,k3=(k2+1+g%5)%6;R.pick2.push((m.tr[k2][T]+m.tr[k3][T])/2/inf);
 R.piggy.push(Math.pow(1+.02/12,T)/inf);
 {let inv=true,cash=0,sh=1,pk=1,sold=0;for(let t=1;t<=T;t++){if(inv){pk=Math.max(pk,ip[t]);if(ip[t]<pk*.8){cash=sh*ip[t];sh=0;inv=false;sold=ip[t];}}else{cash*=1+.02/12;if(ip[t]>sold*1.15){sh=cash/ip[t]*.99;cash=0;inv=true;pk=ip[t];}}}R.panic.push((sh*ip[T]+cash)/inf);}
 {let v=1,f=false;for(let t=1;t<=T;t++){v*=f?m.fad[t]/m.fad[t-1]:ip[t]/ip[t-1];if(t>=3){const ch=m.fad[t]/m.fad[t-3];if(!f&&ch>1.3){f=true;v*=.99}else if(f&&ch<.8){f=false;v*=.99}}}R.fadchase.push(v/inf);}
 if(m.regs.includes(2))sl++;let pk=1,d=0;for(const v of ip){pk=Math.max(pk,v);d=Math.max(d,1-v/pk);}dd.push(d);}
const q=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(p*(s.length-1))]};
for(const k in R)console.log(k.padEnd(9),'real x p10/p50/p90',[.1,.5,.9].map(p=>q(R[k],p).toFixed(2)).join(' / '),' P(real loss)',(R[k].filter(x=>x<1).length/N).toFixed(2),k!=='town'?' P(town wins) '+(R.town.filter((x,i)=>x>R[k][i]).length/N).toFixed(2):'');
console.log('slump runs',sl/N,'town maxDD p50/p90',q(dd,.5).toFixed(2),q(dd,.9).toFixed(2),'pi',pi.map(x=>x.toFixed(3)));
