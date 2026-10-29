import vm from 'node:vm';
import fs from 'node:fs';
import assert from 'node:assert/strict';
for(const filename of ['web/src/core/scroll.js','web/diorama-core/scroll.js']) {
 const code=fs.readFileSync(filename,'utf8').replace(/^import .*;$/gm,'').replace(/^export \{.*\};$/gm,'').replace(/export function /g,'function ');
 let listener; const style={overflow:'scroll'};
 const context={scrollY:0,innerHeight:800,performance,setTimeout,clearTimeout,gsap:{registerPlugin(){}},ScrollTrigger:{update(){},refresh(){}},SplitText:{},document:{documentElement:{scrollHeight:2000,style},querySelector(){return {getBoundingClientRect(){return {top:100}}}}},window:{addEventListener(name,fn){if(name==='scroll')listener=fn},removeEventListener(){},scrollTo({top}){context.scrollY=top}}};
 vm.createContext(context);vm.runInContext(code,context);
 const api=context.smoothScroll();
 api.scrollTo(500);assert.equal(context.scrollY,500);
 api.scrollTo(5000);assert.equal(context.scrollY,1200);
 api.scrollTo(-100);assert.equal(context.scrollY,0);
 api.scrollTo('#target',{offset:25});assert.equal(context.scrollY,125);
 api.stop();assert.equal(style.overflow,'hidden');api.start();assert.equal(style.overflow,'scroll');
 let received=0;const off=api.on('scroll',()=>received++);listener();assert.equal(received,1);off();listener();assert.equal(received,1);
 api.destroy();assert.equal(context.window.__lenis,undefined);
 console.log('PASS native scroll compatibility:',filename);
}
