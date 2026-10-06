'use client';

import { useId, useState } from 'react';
import { Pane } from '@godcreator/docfirst-explainer';
import { system, components, plugin } from './diagrams.data.mjs';

type Node = {id:string; title:string; detail:string; external?:boolean; capabilities?:string[]};
type Edge = {id:string;from:string;to:string;label:string;text:string;disk?:boolean};
type Diagram = {title:string;nodes:Node[];edges:Edge[]};

function Map({data}:{data:Diagram}) {
 const [selected,setSelected] = useState<string|null>(null);
 const [hover,setHover] = useState<string|null>(null);
 const marker = useId().replaceAll(':','');
 const edges = data.edges.filter(e=>selected===`e${e.id}` || selected===`n${e.from}` || selected===`n${e.to}`);
 const activeNodes = new Set(edges.flatMap(e=>[e.from,e.to]));
 if(selected?.startsWith('n')) activeNodes.add(selected.slice(1));
 const chosen = data.edges.find(e=>selected===`e${e.id}`);
 const hoverText = data.edges.find(e=>hover===`e${e.id}`)?.text ?? data.nodes.find(n=>hover===`n${n.id}`)?.detail;
 const select = (key:string)=>setSelected(current=>current===key?null:key);
 const nodeY = (id:string)=>32+data.nodes.findIndex(n=>n.id===id)*155;
 return <section className="seam-map dx not-prose" aria-label={data.title}>
  <p className="map-hint">悬停查看说明 · 点击模块或编号固定高亮 · 再点取消</p>
  <div className="map-layout">
   <div className="map-mobile" aria-label="模块列表">
    {data.nodes.map(n=><button key={n.id} aria-pressed={selected===`n${n.id}`} className={selected&&!activeNodes.has(n.id)?'muted':''} onClick={()=>select(`n${n.id}`)}><strong>{n.title}</strong><span>{n.detail}</span>{n.capabilities?.map(cap=><code key={cap}>{cap}</code>)}</button>)}
   </div>
   <svg viewBox="0 0 720 656" role="group" aria-label={data.title}>
    <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>
    {data.edges.map((e,index)=>{
      const start=nodeY(e.from)+57, end=nodeY(e.to)+57;
      const left=index%2===0, x=left?154:566, rail=left?66+index*12:654-index*12;
      const lit=!selected||edges.includes(e), mid=(start+end)/2;
      return <g key={e.id} className={lit?'map-edge active':'map-edge muted'}>
       <path d={`M ${x} ${start} H ${rail} V ${end} H ${x}`} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray={e.disk?'6 5':undefined} markerEnd={`url(#${marker})`}/>
       <g role="button" tabIndex={0} aria-label={`接缝 ${e.id} ${e.label}`} aria-pressed={selected===`e${e.id}`} onClick={()=>select(`e${e.id}`)} onKeyDown={v=>{if(v.key==='Enter'||v.key===' '){v.preventDefault();select(`e${e.id}`);}}} onMouseEnter={()=>setHover(`e${e.id}`)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover(`e${e.id}`)} onBlur={()=>setHover(null)}>
        <circle cx={rail} cy={mid} r="17" className="map-number"/><text x={rail} y={mid+5} textAnchor="middle" className="map-number-text">{e.id}</text>
       </g>
      </g>;
    })}
    {data.nodes.map(n=><g key={n.id} role="button" tabIndex={0} aria-label={n.title} aria-pressed={selected===`n${n.id}`} className={`map-node ${n.external?'external':''} ${selected&&!activeNodes.has(n.id)?'muted':''}`} onClick={()=>select(`n${n.id}`)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(`n${n.id}`);}}} onMouseEnter={()=>setHover(`n${n.id}`)} onMouseLeave={()=>setHover(null)} onFocus={()=>setHover(`n${n.id}`)} onBlur={()=>setHover(null)}>
      <rect x="156" y={nodeY(n.id)} width="408" height="116" rx="12" className="map-module"/>
      <text x="176" y={nodeY(n.id)+27} className="map-title">{n.title}</text>
      <text x="176" y={nodeY(n.id)+49} className="map-detail">{n.detail}</text>
      {n.capabilities?.map((cap,i)=><g key={cap}><rect x="172" y={nodeY(n.id)+59+i*25} width="376" height="23" rx="5" className="map-capability"/><text x="182" y={nodeY(n.id)+75+i*25} className="map-detail">{cap}</text></g>)}
     </g>)}
   </svg>
   <div className="map-notes">
    <Pane title="接缝与责任" role="blue"><p>{chosen?.text ?? (selected ? data.nodes.find(n=>selected===`n${n.id}`)?.detail : '虚线框是模块，框内方块是能力。实线表示调用或 import，虚线表示读写文件。')}</p></Pane>
    <div className="map-tooltip" role="status">{hoverText || '悬停模块或编号，查看它承担的责任。'}</div>
    <ol>{data.edges.map(e=><li key={e.id}><button aria-pressed={selected===`e${e.id}`} onClick={()=>select(`e${e.id}`)}>{e.text}</button></li>)}</ol>
   </div>
  </div>
 </section>;
}
export const SystemMap = ()=> <Map data={system}/>;
export const ComponentsMap = ()=> <Map data={components}/>;
export const PluginMap = ()=> <Map data={plugin}/>;
