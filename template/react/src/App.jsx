import { MathText, Equation } from '@godcreator/academic-deck';
import { Figure } from '@godcreator/academic-deck';
import { Circuit } from '@godcreator/academic-deck';
import { CircuitSlide, TheorySlide, ResultsSlide } from '@godcreator/academic-deck/samples/dab';
import { createDesignPages } from './slides/DesignSpec';

import { Deck } from '@godcreator/academic-deck';
const designPages=[{label:'电路＋波形',title:'DAB 单移相控制与功率传输',body:CircuitSlide},{label:'理论推导',title:'DAB 匹配电压下的功率推导',body:TheorySlide},{label:'实验结果对比',title:'DAB 实验结果对比（示例）',body:ResultsSlide},...createDesignPages({MathText,Equation,Figure,Circuit})];

const pages=designPages.map(page=>({...page,reference:page.spec ? '学术汇报设计规范 · 正文页 · React / 浏览器 / PDF' : <>[1] Texas Instruments. <a href="https://www.ti.com/lit/pdf/tidues0" target="_blank" rel="noreferrer">TIDA-010054 Design Guide, Rev. F, §2.3.4.1, Eq. (6), 2026.</a></>}));
export default function App(){return <Deck pages={pages} title="学术汇报 · 设计规范（定稿）" subtitle="3 页内容样张 + 5 页设计规范；安全区可调。"/>}
