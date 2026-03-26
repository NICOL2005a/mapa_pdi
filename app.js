// ================================================================
// VARIABLES GLOBALES
// ================================================================
var histAnim  = null;
var noiseTimer = null;
var colorState = { r: 180, g: 80, b: 200 };

// ================================================================
// DATA
// ================================================================
var DATA = {
img:{t:'Imagen Digital',u:'Unidad 1 · Fundamentos',c:'#f8a7c8',tc:'#c0487e',f:'$f(x,y)$',demo:'grid'},
hist:{t:'Histograma',u:'Unidad 1 · Intensidad',c:'#f8a7c8',tc:'#c0487e',f:'$h(r_k)=n_k$',demo:'hist'},
color:{t:'Color',u:'Unidad 1 · Color',c:'#f8a7c8',tc:'#c0487e',f:'RGB→HSV',demo:'color'},
ai:{t:'Análisis',u:'Unidad 2',c:'#c9a7f0',tc:'#7c4dbe',f:'Otsu',demo:'seg'},
eti:{t:'Etiquetado',u:'Unidad 2',c:'#c9a7f0',tc:'#7c4dbe',f:'V4/V8',demo:'label'},
rui:{t:'Ruido',u:'Unidad 2',c:'#a7c8f8',tc:'#3a7dd4',f:'Gauss',demo:'noise'},
ops:{t:'Operaciones',u:'Unidad 2',c:'#a7c8f8',tc:'#3a7dd4',f:'h=f+g',demo:'ops'}
};

// ================================================================
// DEMOS
// ================================================================
function runDemo(key){
if(histAnim) clearInterval(histAnim);
if(noiseTimer) clearInterval(noiseTimer);

var cv = document.getElementById('dc');
var demos = {
grid: demoGrid,
hist: demoHist,
color: demoColor,
seg: demoSeg,
label: demoLabel,
noise: demoNoise,
ops: demoOps
};
demos[DATA[key].demo](cv);
}

// ===== DEMO GRID =====
function demoGrid(cv){
var ctx=cv.getContext('2d');
ctx.clearRect(0,0,cv.width,cv.height);
for(let x=0;x<8;x++){
for(let y=0;y<5;y++){
let val=Math.random()*255;
ctx.fillStyle=`rgb(${val},${val*.7},${val*.9})`;
ctx.fillRect(x*40,y*20,38,18);
}
}
}

// ===== DEMO HIST =====
function demoHist(cv){
var ctx=cv.getContext('2d');
var vals=new Array(30).fill(0).map(()=>Math.random()*100);
histAnim=setInterval(()=>{
ctx.clearRect(0,0,cv.width,cv.height);
vals=vals.map(v=>v+Math.random()*5);
vals.forEach((v,i)=>{
ctx.fillStyle="#c0487e";
ctx.fillRect(i*10,cv.height-v,8,v);
});
},100);
}

// ===== DEMO COLOR =====
function demoColor(cv){ drawColor(cv); }
function drawColor(cv){
var ctx=cv.getContext('2d');
ctx.fillStyle=`rgb(${colorState.r},${colorState.g},${colorState.b})`;
ctx.fillRect(0,0,cv.width,cv.height);
}

// ===== DEMO SEG =====
function demoSeg(cv){ drawSeg(cv,120); }
function drawSeg(cv,T){
var ctx=cv.getContext('2d');
for(let x=0;x<cv.width;x++){
for(let y=0;y<cv.height;y++){
let val=Math.random()*255;
ctx.fillStyle= val>T ? "#fff" : "#7c4dbe";
ctx.fillRect(x,y,1,1);
}
}
}

// ===== DEMO LABEL =====
function demoLabel(cv){
var ctx=cv.getContext('2d');
ctx.fillStyle="#eee";
ctx.fillRect(0,0,cv.width,cv.height);
for(let i=0;i<20;i++){
ctx.fillStyle=`hsl(${Math.random()*360},70%,60%)`;
ctx.fillRect(Math.random()*300,Math.random()*100,20,20);
}
}

// ===== DEMO NOISE =====
function demoNoise(cv){
var ctx=cv.getContext('2d');
noiseTimer=setInterval(()=>{
for(let x=0;x<cv.width;x++){
for(let y=0;y<cv.height;y++){
let n=Math.random()*255;
ctx.fillStyle=`rgb(${n},${n},${n})`;
ctx.fillRect(x,y,1,1);
}
}
},500);
}

// ===== DEMO OPS =====
function demoOps(cv){
var ctx=cv.getContext('2d');
ctx.fillStyle="#c9a7f0";
ctx.fillRect(0,0,cv.width/2,cv.height);
ctx.fillStyle="#a7c8f8";
ctx.fillRect(cv.width/2,0,cv.width/2,cv.height);
}

// ================================================================
// PANEL
// ================================================================
function openPanel(key){

// ===== EFECTO FOCUS =====
document.querySelectorAll('.sn').forEach(n=>{
n.classList.add('dim');
n.classList.remove('active');
});

const map={
img:'n-img',hist:'n-hist',color:'n-color',
ai:'n-ai',eti:'n-eti',rui:'n-rui',ops:'n-ops'
};

var node=document.getElementById(map[key]);
if(node){
node.classList.remove('dim');
node.classList.add('active');
}

document.getElementById('ms').classList.add('zoomed');

// ===== CONTENIDO =====
var d=DATA[key];
document.getElementById('ptitle').textContent=d.t;
document.getElementById('punit').textContent=d.u;
document.getElementById('pformula').innerHTML=d.f;

runDemo(key);

document.getElementById('overlay').classList.add('show');
document.getElementById('pnl').classList.add('show');
}

// ================================================================
function closePanel(){
if(histAnim) clearInterval(histAnim);
if(noiseTimer) clearInterval(noiseTimer);

document.getElementById('overlay').classList.remove('show');
document.getElementById('pnl').classList.remove('show');

document.querySelectorAll('.sn').forEach(n=>{
n.classList.remove('dim','active');
});

document.getElementById('ms').classList.remove('zoomed');
}

// ================================================================
// EVENTOS
// ================================================================
document.addEventListener('DOMContentLoaded',function(){

const map={
'n-img':'img',
'n-hist':'hist',
'n-color':'color',
'n-ai':'ai',
'n-eti':'eti',
'n-rui':'rui',
'n-ops':'ops'
};

Object.keys(map).forEach(id=>{
let el=document.getElementById(id);
if(el){
el.addEventListener('click',()=>openPanel(map[id]));
}
});

document.getElementById('pcl').onclick=closePanel;
document.getElementById('overlay').onclick=closePanel;

document.getElementById('bmap').onclick=()=>switchView('map');
document.getElementById('bcards').onclick=()=>switchView('cards');
});

// ================================================================
function switchView(v){
document.getElementById('mapv').style.display=v==='map'?'block':'none';
document.getElementById('cardsv').style.display=v==='cards'?'block':'none';
}

// ================================================================
window.openPanel=openPanel;
window.closePanel=closePanel;
window.switchView=switchView;
