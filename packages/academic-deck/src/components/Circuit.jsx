import { useId } from 'react';
import { SvgMath } from './Math';
import circuitMarkup from '../assets/dab-circuit-paths.svg?raw';
const tex=String.raw;
export function Circuit() {
  const id='circuit-'+useId().replace(/[^a-z0-9_-]/gi,'_');
  const wires=circuitMarkup.replace(/^<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'').replaceAll('id="switch"',`id="${id}-switch"`).replaceAll('#switch',`#${id}-switch`).replaceAll('id="c-arrow"',`id="${id}-arrow"`).replaceAll('#c-arrow',`#${id}-arrow`).replaceAll('id="circuit-title"',`id="${id}-title"`).replaceAll('id="circuit-desc"',`id="${id}-desc"`);
  const labels = [
    [6,3,38,'V_1'],[555,3,48,'V_2'],[225,28,40,'i_L'],[227,71,30,'L'],[278,39,70,'n:1'],
    [55,97,25,'A'],[149,128,25,'B'],[446,95,25,'C'],[534,128,25,'D'],
    [100,51,31,'S_1'],[100,146,31,'S_2'],[180,49,31,'S_3'],[180,148,31,'S_4'],
    [452,49,31,'S_5'],[452,148,31,'S_6'],[532,49,31,'S_7'],[532,148,31,'S_8']
  ];
  return <svg className="circuit" viewBox="0 0 610 244" role="img" aria-label="双有源桥主电路，理想开关，跨线弧表示不相连">
    <g dangerouslySetInnerHTML={{ __html: wires }} />
    {labels.map(([x,y,w,label]) => <SvgMath key={label} x={x} y={y} w={w} size={label.startsWith('S')?18:20}>{label}</SvgMath>)}
    <SvgMath x={49} y={213} w={164} h={30}>{tex`\text{原边全桥}\;v_{AB}`}</SvgMath>
    <SvgMath x={405} y={213} w={164} h={30}>{tex`\text{副边全桥}\;v_{CD}`}</SvgMath>
  </svg>;
}
