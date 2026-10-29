import {studies,shot} from '../web/site/data.js';
import {stat,readdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const root=process.cwd();
async function files(dir){let out=[];try{for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await files(p));else out.push(p);}}catch(e){if(e.code!=='ENOENT')throw e;}return out;}
const entries=[];
for(const s of studies){
 const variants=[];
 for(const suffix of ['', '-320','-640']){
  const url=`/img/index/${s.slug}${suffix}.webp`,file=path.join(root,'web/public',url);
  const info=await stat(file); const dimensions=execFileSync('sips',['-g','pixelWidth','-g','pixelHeight',file],{encoding:'utf8'});
  variants.push({url,bytes:info.size,width:Number(dimensions.match(/pixelWidth: (\d+)/)?.[1]),height:Number(dimensions.match(/pixelHeight: (\d+)/)?.[1])});
 }
 const models=[];
 for(const file of await files(path.join(root,'web/public/models',s.slug))){if(file.endsWith('.glb'))models.push({url:'/'+path.relative(path.join(root,'web/public'),file),bytes:(await stat(file)).size});}
 entries.push({slug:s.slug,name:s.name,route:`/examples/${s.slug}/`,preview:shot(s.slug),captureStatus:'existing-upstream-preview; fresh browser capture not performed',video:null,variants,models,modelBytes:models.reduce((n,x)=>n+x.bytes,0),browserInteractionStatus:'not verified in this revision'});
}
const result={generatedAt:new Date().toISOString(),method:'filesystem stat and native sips dimensions; no browser rendering or network timing measurements',studyCount:entries.length,previewBytes:entries.reduce((n,s)=>n+s.variants.find(v=>v.url===s.preview).bytes,0),allVariantBytes:entries.reduce((n,s)=>n+s.variants.reduce((a,v)=>a+v.bytes,0),0),modelBytes:entries.reduce((n,s)=>n+s.modelBytes,0),studies:entries};
await writeFile('docs/media-manifest.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({studies:result.studyCount,previewBytes:result.previewBytes,allVariantBytes:result.allVariantBytes,modelBytes:result.modelBytes}));
