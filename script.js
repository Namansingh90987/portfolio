(function(){
function ripple(x,y){var r=document.createElement('div');r.className='ripple';r.style.left=x+'px';r.style.top=y+'px';document.body.appendChild(r);setTimeout(function(){r.remove()},800)}
document.addEventListener('pointerdown',function(e){ripple(e.clientX,e.clientY)});
var fine=window.matchMedia&&matchMedia('(pointer:fine)').matches;
var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
if(!fine||calm)return;
var sel='.card,.tech,.chips span,.photo,.tag';
document.addEventListener('mousemove',function(e){
var el=e.target.closest&&e.target.closest(sel);
document.querySelectorAll('.moving').forEach(function(n){if(n!==el){n.classList.remove('moving');n.style.transform=''}});
if(!el)return;
var r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
var px=x/r.width-.5,py=y/r.height-.5;
var big=r.width>500?0.35:1;
el.classList.add('moving');
el.style.setProperty('--mx',x+'px');el.style.setProperty('--my',y+'px');
el.style.transform='perspective(700px) rotateX('+(-py*9*big)+'deg) rotateY('+(px*9*big)+'deg) translateY(-4px)';
});
document.addEventListener('mouseleave',function(){document.querySelectorAll('.moving').forEach(function(n){n.classList.remove('moving');n.style.transform=''})});
})();

(function(){
var root=document.documentElement,btn=document.getElementById('theme');
function sys(){return window.matchMedia&&matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}
var cur;try{cur=localStorage.getItem('theme')}catch(e){}
if(cur!=='dark'&&cur!=='light')cur=sys();
function apply(m){cur=m;root.setAttribute('data-theme',m);btn.textContent=m==='dark'?'☀️':'🌙'}
apply(cur);
btn.addEventListener('click',function(){var n=cur==='dark'?'light':'dark';apply(n);try{localStorage.setItem('theme',n)}catch(e){}});
})();

(function(){
var b=document.getElementById('copyMail');if(!b)return;
b.addEventListener('click',function(){
var m=b.getAttribute('data-mail');
function done(){b.textContent='Copied ✓';setTimeout(function(){b.textContent='Copy Email'},1800)}
function fallback(){var a=document.createElement('textarea');a.value=m;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();try{document.execCommand('copy');done()}catch(e){window.prompt('Copy this email:',m)}a.remove()}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(m).then(done,fallback)}else{fallback()}
});
})();

(function(){
var intro=document.getElementById('intro'),root=document.documentElement;
if(!intro){root.classList.remove('intro-on');return}
var bar=document.getElementById('bar'),pct=document.getElementById('pct'),loader=document.getElementById('loader'),hello=document.getElementById('hello');
var C=339.3,DUR=2600,done=false,timers=[];
function T(f,ms){timers.push(setTimeout(f,ms))}
function finish(){if(done)return;done=true;timers.forEach(clearTimeout);intro.classList.add('open');T(function(){intro.remove();root.classList.remove('intro-on')},1200)}
document.getElementById('skip').addEventListener('click',finish);
T(finish,15000);
function ease(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2}
var st=null,wr=document.getElementById('wr');
function write(){
var tx=hello.querySelector('text'),n=5,ends=[],x0=0;
try{var bb=tx.getBBox();x0=bb.x-12;for(var i=0;i<n;i++){ends.push(tx.getEndPositionOfChar(i).x+(i===n-1?14:2))}}
catch(e){var bb2=tx.getBBox();x0=bb2.x-12;for(var j=0;j<n;j++){ends.push(bb2.x+bb2.width*(j+1)/n+(j===n-1?14:0))}}
var cur=0,from=x0;
function letter(){
if(done)return;
if(cur>=n){wr.setAttribute('width',600);T(finish,900);return}
var to=ends[cur],s=null,D=900;
function step(ts){if(done)return;if(s===null)s=ts;var p=Math.min((ts-s)/D,1);
var e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
wr.setAttribute('width',from+(to-from)*e);
if(p<1){requestAnimationFrame(step)}else{from=to;cur++;T(letter,220)}}
requestAnimationFrame(step)}
letter()}
function tick(ts){
if(done)return;if(st===null)st=ts;
var p=Math.min((ts-st)/DUR,1),v=Math.round(ease(p)*100);
pct.textContent=v+'%';bar.style.strokeDashoffset=C*(1-ease(p));
if(p<1){requestAnimationFrame(tick)}else{
T(function(){loader.classList.add('gone');
T(function(){hello.classList.add('show');write()},450)},250)}
}
requestAnimationFrame(tick);
if(document.fonts&&document.fonts.load){document.fonts.load('200px Sacramento')}
})();
