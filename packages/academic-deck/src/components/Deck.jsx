import { useEffect, useState } from 'react';
import logoUrl from '../assets/logo-xjtu.png';
import { SlideActivityContext } from './SlidePlayback';

const defaultMargins={left:24,right:24,top:80,bottom:28};
const marginFields=[['left','左边',16,100],['right','右边',16,100],['top','上边',72,118],['bottom','下边',28,70]];
function Measures({margins:m}){
  const r=960-m.right,b=540-m.bottom;
  return <svg className="measure-overlay" viewBox="0 0 960 540" aria-hidden="true"><path d={`M0 280 H${m.left} M${r} 280 H960 M710 0 V${m.top} M710 ${b} V540`}/><text x={m.left/2} y="273">{m.left}</text><text x={(r+960)/2} y="273">{m.right}</text><text x="730" y={m.top/2}>{m.top}</text><text x="730" y={(b+540)/2+4}>{m.bottom}</text></svg>;
}
export function Slide({page,index,margins=defaultMargins,total,active=false}){const Body=page.body;const body=<SlideActivityContext.Provider value={active}><Body/></SlideActivityContext.Provider>;if(page.kind)return <article className={`slide slide-${page.kind}`} aria-label={page.title}>{body}</article>;return <article className="slide" aria-label={page.title} style={Object.fromEntries(Object.entries(margins).map(([key,value])=>['--'+key,value+'pt']))}><header className="slide-heading"><div className="chevrons" aria-hidden="true"><i/><i/></div><h1 className="page-title">{page.title}</h1></header><img className="logo" src={logoUrl} alt="西安交通大学"/>{body}<footer className="slide-footer"><p className="references">{page.reference ?? null}</p><div className="page-no"><b>{index+1}</b><span>/{total}</span></div></footer><div className="page-bar"/><div className="frame frame-outer" aria-hidden="true"/><div className="frame frame-inner" aria-hidden="true"/><Measures margins={margins}/></article>}
export function Deck({pages,title="学术汇报",subtitle="",showGuides=true}){
  const [page,setPage]=useState(()=>Math.min(pages.length-1,Math.max(0,(Number(location.hash.slice(1))||1)-1))),[guides,setGuides]=useState(showGuides),[scale,setScale]=useState(1);
  const [margins,setMargins]=useState(defaultMargins),[warning,setWarning]=useState('');
  useEffect(()=>{
    const resize=()=>{const stage=document.querySelector('.stage'),padding=innerWidth<=720?24:48,remaining=innerHeight-stage.getBoundingClientRect().top-document.querySelector('.review-note').offsetHeight-16;setScale(Math.max(.2,Math.min((stage.clientWidth-padding)/1280,remaining/720,1.2)))};
    const observer=new ResizeObserver(resize);document.querySelectorAll('.review-header,.toolbar,.boundary-controls,.boundary-legend,.review-note').forEach(el=>observer.observe(el));resize();addEventListener('resize',resize);
    const key=e=>{if(['INPUT','BUTTON','A'].includes(e.target.tagName))return;if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();setPage(p=>(p+1)%pages.length)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();setPage(p=>(p+pages.length-1)%pages.length)}};addEventListener('keydown',key);return()=>{observer.disconnect();removeEventListener('resize',resize);removeEventListener('keydown',key)};
  },[]);
  useEffect(()=>{
    let cancelled=false;
    const check=()=>{if(cancelled)return;const slide=document.querySelector('.slide-slot:not([hidden]) .slide'),core=slide.querySelector('.content'),b=core.getBoundingClientRect(),foot=slide.querySelector('.slide-footer').getBoundingClientRect(),heading=slide.querySelector('.slide-heading').getBoundingClientRect(),logo=slide.querySelector('.logo').getBoundingClientRect();
      const overflow=[...core.querySelectorAll('section,aside,.figure,.formula,.equation,p,table,h2,li')].some(el=>{const r=el.getBoundingClientRect();return (el.matches('section,aside')&&el.scrollHeight>el.clientHeight+3)||el.scrollWidth>el.clientWidth+3||r.bottom>b.bottom+2||r.right>b.right+2});
      setWarning(overflow?'当前正文超出安全区':b.bottom>foot.top?'正文与页脚重叠':heading.right>logo.left?'标题与校徽重叠':Math.max(heading.bottom,logo.bottom)>b.top?'页眉与正文重叠':'');
    };const frame=requestAnimationFrame(check);document.fonts.ready.then(check);return()=>{cancelled=true;cancelAnimationFrame(frame)};
  },[page,margins,scale]);
  const updateMargin=(key,value,min,max)=>{if(value==='')return;const number=Number(value);if(Number.isFinite(number))setMargins(current=>({...current,[key]:Math.min(max,Math.max(min,number))}))};
  return <main className={guides?'':'no-guides'}><header className="review-header"><h1>{title}</h1><p>{subtitle}</p></header>
    <nav className="toolbar" aria-label="样张切换">{pages.map((p,i)=><button key={p.label} aria-current={page===i} onClick={()=>setPage(i)}>{i+1} · {p.label}</button>)}<label><input type="checkbox" checked={guides} onChange={e=>setGuides(e.target.checked)}/> 显示安全区</label><button className="export" onClick={()=>window.print()}>打印 / PDF</button></nav>
    <div className="boundary-controls" role="group" aria-label="安全区边距">{marginFields.map(([key,label,min,max])=><label className="boundary-control" key={key}>{label}<input type="range" id={key+'-range'} aria-label={label+'距滑块'} min={min} max={max} value={margins[key]} onChange={e=>updateMargin(key,e.target.value,min,max)}/><input type="number" id={key} aria-label={label+'距'} min={min} max={max} value={margins[key]} onChange={e=>updateMargin(key,e.target.value,min,max)}/>pt</label>)}<button id="reset" onClick={()=>setMargins({...defaultMargins})}>恢复确认值</button></div>
    <div className="boundary-legend"><span><i className="legend-key"/>画布 960 × 540 pt</span><span><i className="legend-key inner"/>核心安全区 {960-margins.left-margins.right} × {540-margins.top-margins.bottom} pt</span><span className={'boundary-status'+(warning?' warn':'')} role="status">{warning||'当前页内容未超出安全区'}</span></div>
    <div className="stage">{pages.map((p,i)=><div key={p.label} className="slide-slot" hidden={page!==i} style={{width:1280*scale,height:720*scale}}><div className="slide-transform" style={{transform:`scale(${scale})`,transformOrigin:'top left'}}><Slide page={p} index={i} margins={margins} total={pages.length} active={page===i}/></div></div>)}</div><footer className="review-note"><span>当前边距：左 {margins.left}／右 {margins.right}／上 {margins.top}／下 {margins.bottom} pt；参考文献与页码在安全区下方齐平。</span><span>{page+1} / {pages.length} · ← → 翻页</span></footer></main>;
}
