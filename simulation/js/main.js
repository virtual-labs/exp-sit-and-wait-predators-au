let last=null;const EP=2;
function g(id){return +document.getElementById(id).value;}
const chart=()=>document.getElementById('chart');
function build(){
  const a=g('a'),v=g('v'),EC=g('EC'),EB=g('EB'),s=Math.round(g('start')),e=Math.round(g('end'));
  const mode=document.getElementById('plotMode').value;const d=[];const step=Math.max(1,(e-s)/40);
  for(let r=s;r<=e+1e-9;r+=step){const tw=1/(a*Math.PI*r*r);const tp=(2/3)*r/v;const ti=tw+tp;const ei=EC-EB*tw-EP*tp;const et=ei/ti;
    let y;if(mode==='wait')y=tw;else if(mode==='pursue')y=tp;else y=et;d.push([+r.toFixed(2),+y.toFixed(3)]);}
  return {d,mode};
}
function run(){
  const b=build();last=b;
  const info={wait:['Waiting time per prey (reciprocal proportion)','Waiting time (s)','#b50246','Waiting time'],pursue:['Average pursuit time per prey','Pursuit time (s)','#0e7c86','Pursuit time'],energy:['Net energy gain per time','Energy gain (e/s)','#e0662c','Net energy gain']}[b.mode];
  Chart.draw(chart(),[{color:info[2],data:b.d}],{xlabel:'Cut-off radius r',ylabel:info[1],ratio:0.55});setLegend([{color:info[2],name:info[3]}]);
  document.getElementById('plotTitle').textContent=info[0];
  if(b.mode==='energy'){let best=b.d[0];b.d.forEach(p=>{if(p[1]>best[1])best=p;});document.getElementById('counts').innerHTML=`Net energy gain is maximised at a cut-off radius of about <b>${best[0]}</b> — the optimal detection distance. Smaller radii waste time waiting; larger radii waste energy in long pursuits.`;}
  else document.getElementById('counts').innerHTML=(b.mode==='wait')?'A larger cut-off radius shortens the wait between prey.':'A larger cut-off radius lengthens the average pursuit.';
}
function sync(){document.querySelectorAll('#simbox .val').forEach(function(v){var el=document.getElementById(v.id.slice(2));if(el)v.textContent=el.value;});}
const D={a:0.1,v:10,EC:250,EB:0.1,start:1,end:20};
function resetSim(){for(const k in D)document.getElementById(k).value=D[k];document.getElementById('plotMode').value='wait';sync();run();toast('Reset');}
function downloadCSV(){if(!last){toast('Plot first');return;}let csv='cutoff_radius,'+last.mode+'\n'+last.d.map(r=>r[0]+','+r[1]).join('\n');dl(csv,'sit-and-wait.csv','text/csv');toast('CSV downloaded');}
var _lr;document.querySelectorAll('#simbox input[type=range]').forEach(function(el){el.addEventListener('input',function(){clearTimeout(_lr);_lr=setTimeout(run,110);});});
sync();window.addEventListener('resize',function(){if(last)run();});
