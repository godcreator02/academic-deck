import { MathText, Equation, SvgMath } from '../components/Math';
import { Figure } from '../components/Figure';
import { Circuit } from '../components/Circuit';
const tex=String.raw;
const V=400, fs=100e3, L=40e-6, delta=1/12, peak=V*delta/(fs*L);
function current(t) {
  if(t<delta)return -peak+2*peak*t/delta;
  if(t<.5)return peak;
  if(t<.5+delta)return peak-2*peak*(t-.5)/delta;
  return -peak;
}
export function Waveforms({ children }) {
  const x=t=>116+400*t;
  const square=(shift,y)=>[[0,y+ (shift?22:-22)],...(shift?[[shift,y+22],[shift,y-22]]:[]),[.5+shift,y-22],[.5+shift,y+22],[1,y+22]].map(([t,v])=>`${x(t)},${v}`).join(' ');
  return <svg className="plot" viewBox="0 0 540 258" role="img" aria-label="一个开关周期的理想桥端电压及电感电流">
    {[0,delta,.5,.5+delta,1].map(t=><line key={t} className="guide" x1={x(t)} x2={x(t)} y1="28" y2="225"/>)}
    {[57,125,199].map(y=><line key={y} className="zero" x1="116" x2="516" y1={y} y2={y}/>)}
    <polyline className="trace" stroke="#c00000" points={square(0,57)}/><polyline className="trace" stroke="#bb862e" points={square(delta,125)}/>
    <polyline className="trace" stroke="#426780" points={[0,delta,.5,.5+delta,1].map(t=>`${x(t)},${199-current(t)*23/peak}`).join(' ')}/>
    <SvgMath x={0} y={42} w={84}>{tex`v_{AB}/\mathrm{V}`}</SvgMath><SvgMath x={0} y={109} w={84}>{tex`nv_{CD}/\mathrm{V}`}</SvgMath><SvgMath x={0} y={182} w={84}>{tex`i_L/\mathrm{A}`}</SvgMath>
    {[[400,41],[-400,84],[400,109],[-400,153],[8.33,183],[-8.33,228]].map(([v,y],i)=><text key={i} x="109" y={y} textAnchor="end">{v}</text>)}
    <SvgMath x={155} y={-2} w={112}>{tex`\varphi=30^\circ`}</SvgMath>
    {[[0,0],[.5,5],[1,10]].map(([t,v])=><text key={v} x={x(t)} y="250" textAnchor="middle">{v}</text>)}
    <SvgMath x={370} y={229} w={78} h={28}>{tex`t/\mathrm{\mu s}`}</SvgMath>
    {children?.({ x, current, peak, delta })}
  </svg>;
}
export function CircuitSlide({ Waveform = Waveforms }) {
  return <div className="content evidence-layout">
    <div className="columns">
      <section className="figure-panel"><h2>主电路与电流方向</h2><Figure number="1" caption="DAB 主电路（理想开关）"><Circuit/></Figure></section>
      <section className="figure-panel"><h2>桥端电压与电感电流</h2><Figure number="2" caption={<>理想稳态波形，<MathText>{tex`\varphi=30^\circ`}</MathText></>}><Waveform/></Figure></section>
    </div>
    <div className="columns explanation">
      <section><h2>SPS 功率关系</h2><Equation number="1">{tex`P=\frac{nV_1V_2}{2\pi f_sL}\,\varphi\!\left(1-\frac{\varphi}{\pi}\right)`}</Equation><p className="small muted"><MathText>{tex`n=N_p/N_s`}</MathText>，<MathText>{tex`0\leq\varphi\leq\pi`}</MathText>；正移相时原边向副边传能。</p></section>
      <section><p>电感电流斜率由两桥电压差决定：</p><Equation className="compact">{tex`L\frac{\mathrm{d}i_L}{\mathrm{d}t}=v_{AB}-nv_{CD}`}</Equation><p className="small muted">示例：<MathText>{tex`V_1=V_2=400\,\mathrm{V},\quad n=1`}</MathText>；<br/><MathText>{tex`f_s=100\,\mathrm{kHz},\quad L=40\,\mathrm{\mu H}`}</MathText>，忽略寄生与死区。</p><p className="accent"><MathText>{tex`P\approx2.78\,\mathrm{kW},\quad I_{\mathrm{pk}}\approx8.33\,\mathrm{A}`}</MathText></p></section>
    </div>
  </div>;
}
export function TheorySlide() {
  return <div className="content derivation-layout">
    <section className="steps"><h2>从电感电压到传输功率</h2>
      <p>定义 <MathText>{tex`D=\varphi/\pi`}</MathText> 与 <MathText>{tex`T_s=1/f_s`}</MathText>，移相时间为 <MathText>{tex`DT_s/2`}</MathText>。</p>
      <Equation number="1">{tex`L\frac{\mathrm{d}i_L}{\mathrm{d}t}=v_{AB}-nv_{CD}`}</Equation>
      <p>在电压匹配条件下，前半周期的电流为</p>
      <Equation number="2" className="piecewise">{tex`i_L(t)=\begin{cases}-I_{\mathrm{pk}}+\dfrac{2V}{L}t,&0\leq t<\dfrac{DT_s}{2},\\[5pt]I_{\mathrm{pk}},&\dfrac{DT_s}{2}\leq t<\dfrac{T_s}{2}.\end{cases}`}</Equation>
      <p>利用半波反对称性，可得峰值与平均功率：</p>
      <Equation number="3">{tex`I_{\mathrm{pk}}=\frac{VD}{2f_sL}`}</Equation>
      <Equation number="4">{tex`P=\frac{2}{T_s}\int_0^{T_s/2}V i_L(t)\,\mathrm{d}t=\frac{V^2D(1-D)}{2f_sL}`}</Equation>
    </section>
    <aside><h2>假设与符号</h2><ul className="assumptions-list"><li>电压匹配：<MathText>{tex`V_1=nV_2=V`}</MathText>。</li><li>理想开关，忽略损耗及死区。</li><li>稳态电流无直流偏置，<br/><MathText>{tex`i_L(t+T_s/2)=-i_L(t)`}</MathText>。</li><li>正向功率区间：<MathText>{tex`0\leq D\leq1`}</MathText>。</li></ul>
      <section className="workpoint"><h2>工作点核算</h2><p className="small muted"><MathText>{tex`V=400\,\mathrm{V},\quad L=40\,\mathrm{\mu H}`}</MathText><br/><MathText>{tex`f_s=100\,\mathrm{kHz},\quad\varphi=\pi/6,\quad D=1/6`}</MathText></p>
        <div className="accent"><Equation>{tex`\begin{aligned}I_{\mathrm{pk}}&\approx8.33\,\mathrm{A},\\[4pt]P&\approx2.78\,\mathrm{kW}.\end{aligned}`}</Equation></div>
        <p className="small muted derivation-note">一般电压比见前页功率关系。</p>
      </section>
    </aside>
  </div>;
}
const compareRows=[15,30,45].map((phi,i)=>{const d=phi/180,p=V*V/(2*fs*L)*d*(1-d)/1000;const sample=[1.50,2.73,3.70][i];return {phi,p,sample,error:100*(sample-p)/p}});
function ComparisonPlot({power=false}) {
  const x=t=>70+440*t, y=v=>power?208-v*31:121-v*8.7;
  const samples=Array.from({length:241},(_,i)=>{const t=i/240;return [x(t),y(current(t)+.18*Math.sin(2*Math.PI*31*t))]});
  return <svg className="plot" viewBox="0 0 540 252" role="img" aria-label={power?'理论功率与合成示例数据对比':'理论电流与合成示例采样对比'}>
    {(power?[0,1,2,3,4,5]:[-10,0,10]).map(v=><g key={v}><line className="guide" x1="70" x2="510" y1={y(v)} y2={y(v)}/><text x="57" y={y(v)+6} textAnchor="end">{v}</text></g>)}
    <path className="axis" d="M70 36 V208 H510"/>
    <SvgMath x={0} y={0} w={114}>{power?tex`P/\mathrm{kW}`:tex`i_L/\mathrm{A}`}</SvgMath>
    <line x1="198" x2="229" y1="17" y2="17" stroke="#c00000" strokeWidth="2.8"/><text x="239" y="24">理论</text><line x1="329" x2="360" y1="17" y2="17" stroke="#426780" strokeDasharray="5 3" strokeWidth="2.3"/><text x="370" y="24">示例采样</text>
    {power?<>
      <polyline className="trace" stroke="#c00000" points={Array.from({length:91},(_,phi)=>{const d=phi/180;return `${x(phi/90)},${y(V*V/(2*fs*L)*d*(1-d)/1000)}`}).join(' ')}/>
      {compareRows.map(r=><rect key={r.phi} x={x(r.phi/90)-4} y={y(r.sample)-4} width="8" height="8" fill="white" stroke="#426780" strokeWidth="2"/>)}
      {[0,30,60,90].map(phi=><text key={phi} x={x(phi/90)} y="233" textAnchor="middle">{phi}</text>)}<SvgMath x={267} y={222} w={70} h={29}>{tex`\varphi/{}^\circ`}</SvgMath>
    </>:<>
      <polyline className="trace" stroke="#c00000" points={[0,delta,.5,.5+delta,1].map(t=>`${x(t)},${y(current(t))}`).join(' ')}/>
      <polyline className="trace" stroke="#426780" strokeDasharray="5 3" style={{strokeWidth:1.8}} points={samples.map(p=>p.join(',')).join(' ')}/>
      {[0,.5,1].map(t=><text key={t} x={x(t)} y="233" textAnchor="middle">{t*10}</text>)}<SvgMath x={353} y={222} w={80} h={29}>{tex`t/\mathrm{\mu s}`}</SvgMath>
    </>}
  </svg>;
}
export function ResultsSlide(){
  return <div className="content results-layout"><p className="small muted">本页为排版演示：采样曲线与表格数据均为合成示例，非实测。</p>
    <div className="figure-group"><div className="columns"><Figure caption={<>(a) 电感电流，<MathText>{tex`\varphi=30^\circ`}</MathText></>}><ComparisonPlot/></Figure><Figure caption="(b) 不同移相角下的传输功率"><ComparisonPlot power/></Figure></div><p className="group-caption"><b className="caption-number">图 3</b>理论值与示例采样对比（合成数据）</p></div>
    <div className="results-bottom"><section><table><caption><b className="caption-number">表 1</b>功率对比（合成数据）</caption><thead><tr><th><MathText>{tex`\varphi`}</MathText></th><th>理论 / kW</th><th>示例 / kW</th><th>偏差 / %</th></tr></thead><tbody>{compareRows.map(r=><tr key={r.phi}><td><MathText>{r.phi+'^\\circ'}</MathText></td><td>{r.p.toFixed(2)}</td><td>{r.sample.toFixed(2)}</td><td>{r.error.toFixed(2)}</td></tr>)}</tbody></table><p className="table-note">偏差按未舍入的理论值计算。</p></section>
    <section><h2>结果描述与偏差定义</h2><p className="small">采用相同的电压、电感与开关频率，对照曲线及表格中的对应工作点。</p><Equation number="5">{tex`\varepsilon_P=\frac{P_{\mathrm{sample}}-P_{\mathrm{th}}}{P_{\mathrm{th}}}\times100\%`}</Equation><p className="small">在 <MathText>{tex`\varphi=30^\circ`}</MathText> 时，示例偏差为 <MathText>{tex`\varepsilon_P=-1.72\%`}</MathText>。</p><p className="small muted">实际汇报时替换为实测数据，并注明采样条件。</p></section></div>
  </div>;
}
