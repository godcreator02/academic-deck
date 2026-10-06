import { Circuit, Equation, Figure, MathText, Cover, Contents, Chapter, Closing } from '@godcreator/academic-deck';
import { CircuitSlide, TheorySlide, ResultsSlide } from '@godcreator/academic-deck/samples/dab';
import { AnimatedDabWaveforms } from './components/AnimatedDabWaveforms';

function AnimatedCircuitSlide(){ return <CircuitSlide Waveform={AnimatedDabWaveforms}/>; }

const tex=String.raw;
const source=<>[1] Texas Instruments. <a href="https://www.ti.com/lit/pdf/tidues0" target="_blank" rel="noreferrer">TIDA-010054 Design Guide, Rev. F, §2.3.4.1, Eq. (6), 2026.</a></>;

function Overview(){
  return <div className="content meeting-overview"><section><h2>双有源桥<br/>单移相控制</h2><p className="lead">从理想模型到验证方案</p><p className="meta">报告人：待填写<br/>研究组：待填写<br/>汇报日期：待填写</p><p className="meeting-note">本报告为模板使用样张。理论值来自理想模型，采样对比采用合成数据。</p></section><Figure number="1" caption="双有源桥 DAB 主电路"><Circuit/></Figure></div>;
}
function Questions(){
  return <div className="content meeting-columns"><section><h2>本次汇报关注什么</h2><div className="meeting-topics"><div><b>01</b><p>桥端电压的相位差如何改变电感电流？</p></div><div><b>02</b><p>给定电压、电感和频率，如何计算传输功率？</p></div><div><b>03</b><p>理论结果如何与后续仿真、实验数据对照？</p></div></div><section className="meeting-section"><h2>汇报顺序</h2><p>主电路与波形 → 理论推导 → 工作点计算 → 数据对比 → 验证计划</p></section></section>
    <section><h2>本轮分析边界</h2><ul className="meeting-list"><li>采用 SPS 单移相控制，分析稳态下的正向功率传输。</li><li>工作点计算采用电压匹配条件：<MathText>{tex`V_1=nV_2`}</MathText>。</li><li>先使用理想开关模型，忽略死区、寄生参数与损耗。</li><li>电感电流无直流偏置；所有示例使用同一符号约定。</li></ul><p className="meeting-note">当前分析给出理想功率和电流，不据此推断效率或软开关范围。</p></section></div>;
}
function WorkingPoints(){
  const points=[15,30,45,90].map(phi=>{const d=phi/180;return {phi,p:400**2/(2*100e3*40e-6)*d*(1-d)/1000,i:400*d/(2*100e3*40e-6)}});
  return <div className="content meeting-columns"><section><h2>保持参数一致</h2><p><MathText>{tex`V_1=V_2=400\,\mathrm{V},\quad n=1`}</MathText></p><p><MathText>{tex`f_s=100\,\mathrm{kHz},\quad L=40\,\mathrm{\mu H}`}</MathText></p><table className="meeting-table"><caption><b className="caption-number">表 1</b>不同移相角下的理论工作点</caption><thead><tr><th><MathText>{tex`\varphi`}</MathText></th><th><MathText>{tex`P/\mathrm{kW}`}</MathText></th><th><MathText>{tex`I_{\mathrm{pk}}/\mathrm{A}`}</MathText></th></tr></thead><tbody>{points.map(p=><tr key={p.phi}><td><MathText>{p.phi+'^\\circ'}</MathText></td><td>{p.p.toFixed(2)}</td><td>{p.i.toFixed(2)}</td></tr>)}</tbody></table><p className="meeting-note">表内数值均由理想模型计算，保留两位小数。</p></section>
    <section><h2>功率与电流的变化</h2><Equation number="1">{tex`P=\frac{V^2}{2f_sL}D(1-D),\quad D=\frac{\varphi}{\pi}`}</Equation><Equation number="2">{tex`I_{\mathrm{pk}}=\frac{VD}{2f_sL}`}</Equation><p>在 <MathText>{tex`0\leq D\leq1/2`}</MathText> 内，增大移相角会同时提高功率与电流峰值。</p><p>当 <MathText>{tex`D=1/2`}</MathText> 时，理想传输功率达到最大值。</p><p className="accent"><MathText>{tex`P_{\max}=5.00\,\mathrm{kW}`}</MathText></p><p className="meeting-note">以上趋势针对本页的固定参数与电压匹配条件。</p></section></div>;
}
function Validation(){
  return <div className="content meeting-columns"><section><h2>待执行的验证步骤</h2><div className="meeting-topics"><div><b>01</b><p>建立理想开关仿真，复现桥端电压、电感电流与平均功率。</p></div><div><b>02</b><p>在相同工作点下加入死区及寄生参数，记录相对理想模型的变化。</p></div><div><b>03</b><p>后续实验按一致的单位、时间窗口及符号约定整理数据。</p></div></div><p className="meeting-note">这是一份验证计划。本样张未包含真实仿真输出或实验测量结果。</p></section>
    <section><h2>核对指标与记录项</h2><table className="meeting-table"><caption><b className="caption-number">表 2</b>验证记录表（待填写）</caption><thead><tr><th>核对项</th><th>记录内容</th></tr></thead><tbody><tr><td>电压相位差</td><td>指令值、波形识别值</td></tr><tr><td>电感电流</td><td>峰值、斜率、直流偏置</td></tr><tr><td>传输功率</td><td>平均窗口、理论值、采样值</td></tr><tr><td>结果偏差</td><td>参数设置与误差定义</td></tr></tbody></table><p className="meeting-note">先检查条件是否一致，再解释模型与采样之间的偏差。</p></section></div>;
}
function Summary(){
  return <div className="content meeting-summary"><p className="takeaway">理想模型给出了统一的功率与电流基准，下一步按相同工作点验证。</p><div className="columns"><section><h2>本次分析结论</h2><ul className="meeting-list"><li>桥端电压差决定电感电流斜率，移相角控制功率传输。</li><li>示例工作点 <MathText>{tex`\varphi=30^\circ`}</MathText> 下：<br/><MathText>{tex`P\approx2.78\,\mathrm{kW}`}</MathText>，<MathText>{tex`I_{\mathrm{pk}}\approx8.33\,\mathrm{A}`}</MathText>。</li><li>功率和电流需要同时比较，不能只报告功率变化。</li></ul></section><section><h2>下次汇报准备</h2><ul className="meeting-list"><li>补充理想开关仿真波形及功率统计。</li><li>逐项加入非理想因素，记录条件和偏差。</li><li>用真实数据替换本样张的合成对比曲线。</li></ul><p className="meeting-status">待讨论：验证工作点与参数扫描范围。</p></section></div><p className="closing">谢谢，欢迎讨论</p></div>;
}

export const pages=[
  {label:'封面',kind:'cover',title:'DAB 单移相控制研究进展',body:()=> <Cover title="DAB 单移相控制研究进展" presenter="待填写"/>},
  {label:'目录',kind:'contents',title:'汇报目录',body:()=> <Contents chapters={[
    {number:'01',title:'研究问题与对象',subtitle:'研究背景 · 分析边界',page:3},
    {number:'02',title:'电路原理与理论分析',page:6},
    {number:'03',title:'理论与采样对比',page:10},
    {number:'04',title:'验证计划与总结',page:12},
  ]}/>},
  {label:'第一章',kind:'chapter',title:'研究问题与对象',body:()=> <Chapter number="01" title="研究问题与对象" subtitle="明确研究对象，统一分析边界"/>},
  {label:'汇报概览',title:'DAB 单移相控制研究进展',body:Overview,reference:'组会汇报样张 · 理论模型与合成示例，不代表实际研究成果'},
  {label:'研究问题',title:'研究问题与分析边界',body:Questions,reference:source},
  {label:'第二章',kind:'chapter',title:'电路原理与理论分析',body:()=> <Chapter number="02" title="电路原理与理论分析" subtitle="由桥端电压推导电流与传输功率"/>},
  {label:'电路波形',title:'DAB 单移相控制与功率传输',body:AnimatedCircuitSlide,reference:source},
  {label:'理论推导',title:'DAB 匹配电压下的功率推导',body:TheorySlide,reference:source},
  {label:'工作点',title:'移相角与理论工作点',body:WorkingPoints,reference:source},
  {label:'第三章',kind:'chapter',title:'理论与采样对比',body:()=> <Chapter number="03" title="理论与采样对比" subtitle="统一工作点与误差定义，通过合成示例展示对比方法。"/>},
  {label:'示例对比',title:'理论与示例采样对比',body:ResultsSlide,reference:source},
  {label:'第四章',kind:'chapter',title:'验证计划与总结',body:()=> <Chapter number="04" title="验证计划与总结" subtitle="明确验证指标，安排仿真、实验与阶段总结。"/>},
  {label:'验证计划',title:'仿真与实验验证计划',body:Validation,reference:'验证计划 · 表格等待填写；本页未报告实测结果'},
  {label:'总结讨论',title:'阶段总结与下一步',body:Summary,reference:source},
  {label:'封底',kind:'closing',title:'谢谢聆听',body:Closing},
];
