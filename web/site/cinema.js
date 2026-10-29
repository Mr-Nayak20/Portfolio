import {studies, shot} from './data.js';
export function cinema(){
 const track=document.querySelector('#reel-track'), viewport=document.querySelector('#reel-window'), toggle=document.querySelector('#reel-toggle');
 track.innerHTML=studies.map((s,i)=>`<a class="film-frame" href="/examples/${s.slug}/"><div class="film-image"><img src="${shot(s.slug)}" alt="${s.name} website preview" loading="lazy" decoding="async"></div><div class="film-caption"><span>${String(i+1).padStart(2,'0')} / ${s.name}</span><span>OPEN ↗</span></div></a>`).join('');
 let paused=matchMedia('(prefers-reduced-motion: reduce)').matches, visible=false, hover=false, last=0, frame=0;
 function tick(t){frame=0;if(paused||!visible||hover||document.hidden)return;if(last) viewport.scrollLeft=Math.max(0,viewport.scrollLeft-(t-last)*.035);if(viewport.scrollLeft<=0)viewport.scrollLeft=viewport.scrollWidth-viewport.clientWidth;last=t;frame=requestAnimationFrame(tick)}
 function sync(){last=0;if(frame)cancelAnimationFrame(frame);frame=0;if(!paused&&visible&&!hover&&!document.hidden)frame=requestAnimationFrame(tick)}
 viewport.scrollLeft=viewport.scrollWidth-viewport.clientWidth;toggle.textContent=paused?'Play reel':'Pause reel';toggle.setAttribute('aria-pressed',String(paused));
 toggle.onclick=()=>{paused=!paused;toggle.textContent=paused?'Play reel':'Pause reel';toggle.setAttribute('aria-pressed',String(paused));sync()};
 viewport.addEventListener('pointerenter',()=>{hover=true;sync()});viewport.addEventListener('pointerleave',()=>{hover=false;sync()});viewport.addEventListener('focusin',()=>{hover=true;sync()});viewport.addEventListener('focusout',()=>{hover=false;sync()});document.addEventListener('visibilitychange',sync);new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync()},{threshold:.05}).observe(viewport);
}
