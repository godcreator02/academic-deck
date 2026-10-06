import { useId } from 'react';
import { SvgMath } from '@godcreator/academic-deck';

const colors = { power: '#44494d', dc: '#b17c13', signal: '#3b637b', sync: '#b17c13', fault: '#c00000' };

function Drawing({ title, height, children }) {
  const id = useId().replaceAll(':', '');
  return <svg className="sst-diagram" viewBox={`0 0 912 ${height}`} role="img" aria-label={title}>
    <title>{title}</title>
    <defs>{Object.entries(colors).map(([key, color]) => <marker key={key} id={`${id}-${key}`} viewBox="0 0 8 8" markerWidth="6" markerHeight="6" refX="7" refY="4" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 Z" fill={color}/></marker>)}</defs>
    {children(id)}
  </svg>;
}

function Text({ x, y, children, anchor = 'middle', className = '', ...rest }) {
  return <text x={x} y={y} textAnchor={anchor} dominantBaseline="central" className={className} {...rest}>{children}</text>;
}

function Box({ x, y, w, h = 48, label, sub, tone = 'power' }) {
  return <g><rect x={x} y={y} width={w} height={h} fill="white" stroke={colors[tone]} strokeWidth="1.5"/>
    <Text x={x+w/2} y={y+h/2-(sub ? 11 : 0)} className="node-title">{label}</Text>
    {sub && <Text x={x+w/2} y={y+h/2+14} className="sub-label">{sub}</Text>}
  </g>;
}

function Line({ d, id, tone = 'power', arrow = false, both = false, dashed = false }) {
  return <g>{(d.match(/M[^M]+/g) || [d]).map((segment, index) => <path key={index} d={segment} fill="none" stroke={colors[tone]} strokeWidth={tone === 'power' || tone === 'dc' ? 2.4 : 1.7} strokeLinejoin="round" strokeDasharray={dashed ? '6 4' : undefined} markerEnd={arrow || both ? `url(#${id}-${tone})` : undefined} markerStart={both ? `url(#${id}-${tone})` : undefined}/>)}</g>;
}

export function PowerChain() {
  return <Drawing title="10 kV 交流经 CHB 及各模块 DAB 接入公共直流母线" height={128}>{id => <>
    <Box x={2} y={26} w={152} h={68} label="10 kV 交流" sub="三相输入"/>
    <Box x={209} y={26} w={183} h={68} label="CHB 级联" sub="每相 6 个 H 桥"/>
    <Box x={447} y={26} w={201} h={68} label="模块化 DAB" sub="18 路高频隔离"/>
    <Box x={703} y={26} w={207} h={68} label="公共直流母线" sub="18 路输出并联" tone="dc"/>
    <Line id={id} d="M154 60 H203 M392 60 H441 M648 60 H697" arrow/>
    <Text x={456} y={116} className="sub-label">功率变换：级联交流接口 → 模块直流环节 → 隔离 DC/DC → 低压直流端口</Text>
  </>}</Drawing>;
}

export function SystemTopology() {
  return <Drawing title="三相各六个 CHB 子模块串联，各 DAB 输出并联至同一直流母线；功率端口采用单线等效表示" height={312}>{id => <>
    <Text x={37} y={14}>交流侧</Text><Text x={410} y={14}>每相 6 个子模块：交流端口串联，DAB 输出并联</Text>
    {['A', 'B', 'C'].map((phase, p) => {
      const y = 39+p*94;
      return <g key={phase} data-phase={phase}>
        <Text x={25} y={y+19} className="node-title">{phase} 相</Text>
        <Line d={`M59 ${y+19} H789`} id={id}/>
        <circle cx="789" cy={y+19} r="3.5" fill="white" stroke={colors.power} strokeWidth="1.5"/>
        {[1, 2, 3, 4, 5, 6].map((n, j) => {
          const x=84+j*114;
          return <g key={n} className="sst-sm" data-module={`${phase}${n}`}>
            <rect x={x-5} y={y-6} width="100" height="77" fill="#fbfbfb" stroke="#c9ced1" strokeDasharray="3 3"/>
            <Line d={`M${x-5} ${y+19} H${x+95}`} id={id}/>
            <Box x={x} y={y} w={90} h={33} label={`H 桥 ${phase}${n}`}/>
            <Line d={`M${x+45} ${y+33} V${y+41}`} id={id}/>
            <Box x={x} y={y+41} w={90} h={26} label="DAB" tone="dc"/>
            <Line d={`M${x+45} ${y+67} V${y+81}`} tone="dc" id={id}/>
          </g>;
        })}
        <Line d={`M129 ${y+81} H844`} tone="dc" id={id}/>
        <circle cx="844" cy={y+81} r="3.3" fill={colors.dc}/>
      </g>;
    })}
    <Line d="M844 32 V308" tone="dc" id={id}/>
    <Text x={881} y={158} transform="rotate(90 881 158)" className="node-title">公共直流母线 · 输出电压待定</Text>
  </>}</Drawing>;
}

function Switch({ x, y }) {
  return <g className="sst-switch" stroke={colors.power} fill="white" strokeWidth="1.8">
    <path d={`M${x} ${y-16} V${y-8} M${x} ${y+8} V${y+16} M${x} ${y-7} l8 11`} fill="none"/>
    <circle cx={x} cy={y-8} r="1.7"/><circle cx={x} cy={y+8} r="1.7"/>
  </g>;
}

function Bridge({ x, y = 58 }) {
  return <g>
    <path d={`M${x} ${y} H${x+64} M${x} ${y+130} H${x+64} M${x} ${y} V${y+14} M${x} ${y+46} V${y+84} M${x} ${y+116} V${y+130} M${x+64} ${y} V${y+14} M${x+64} ${y+46} V${y+84} M${x+64} ${y+116} V${y+130}`} className="electrical-wire"/>
    {[x,x+64].flatMap(a=>[y+30,y+100].map(b=><Switch key={`${a}-${b}`} x={a} y={b}/>))}
    <circle cx={x} cy={y+57} r="2.6" fill={colors.power}/><circle cx={x+64} cy={y+77} r="2.6" fill={colors.power}/>
  </g>;
}

function Capacitor({ x, top = 58, bottom = 188 }) {
  const mid=(top+bottom)/2;
  return <path d={`M${x} ${top} V${mid-5} M${x-11} ${mid-5} H${x+11} M${x-11} ${mid+5} H${x+11} M${x} ${mid+5} V${bottom}`} className="electrical-wire"/>;
}

export function SubmoduleCircuit() {
  return <Drawing title="单子模块理想开关电路：CHB H 桥与 DAB 原边共享直流电容，高频变压器隔离后接入公共直流母线" height={295}>{id => <>
    <Text x={123} y={18} className="node-title">CHB H 桥</Text>
    <Text x={334} y={18} className="node-title">DAB 高压桥</Text>
    <Text x={523} y={18} className="node-title">高频变压器</Text>
    <Text x={675} y={18} className="node-title">DAB 低压桥</Text>
    <Bridge x={88}/><Bridge x={302}/><Bridge x={630}/>
    <Line d="M88 58 H366 M88 188 H366 M630 58 H861 M630 188 H861" id={id}/>
    <Capacitor x={232}/><Capacitor x={790}/>
    <SvgMath x={238} y={112} w={53} size={16}>{String.raw`C_{\mathrm{H}}`}</SvgMath>
    <SvgMath x={796} y={112} w={48} size={16}>{String.raw`C_{\mathrm{L}}`}</SvgMath>
    <Line d="M26 115 H88 M26 156 H62 V210 H176 V194 Q188 188 176 182 V135 H152" id={id}/>
    <circle cx="26" cy="115" r="3" fill="white" stroke={colors.power}/><circle cx="26" cy="156" r="3" fill="white" stroke={colors.power}/>
    <Text x={28} y={91}>a</Text><Text x={28} y={179}>b</Text>
    <path d="M302 115 H360 Q366 103 372 115 H406 q5 -16 10 0 q5 -16 10 0 q5 -16 10 0 q5 -16 10 0 H486 V96 H499 M366 135 H395 V199 H486 V152 H499 M499 96 q16 7 0 14 q16 7 0 14 q16 7 0 14 q16 7 0 14 M548 96 q-16 7 0 14 q-16 7 0 14 q-16 7 0 14 q-16 7 0 14 M548 96 H573 V115 H630 M548 152 H581 V135 H624 Q630 123 636 135 H694 M518 91 V157 M526 91 V157" className="electrical-wire"/>
    <circle cx="493" cy="91" r="2.5" fill={colors.power}/><circle cx="555" cy="91" r="2.5" fill={colors.power}/>
    <SvgMath x={404} y={72} w={50} size={16}>{String.raw`L_{\sigma}`}</SvgMath>
    <SvgMath x={494} y={169} w={61} size={16}>{'n:1'}</SvgMath>
    <Text x={880} y={58}>＋</Text><Text x={880} y={188}>−</Text>
    <Text x={876} y={122} transform="rotate(90 876 122)">公共直流母线</Text>
    <Line d="M598 40 V216" id={id} tone="signal" dashed/>
    <Box x={88} y={239} w={278} h={38} label="子模块高压侧 FPGA" tone="signal"/>
    <Box x={630} y={239} w={233} h={38} label="子模块低压侧 FPGA" tone="signal"/>
    <Line d="M122 239 V220 M336 239 V211 M662 239 V212" id={id} tone="signal" arrow dashed/>
    <Line d="M366 258 H630" id={id} tone="signal" both/>
    <Text x={498} y={239} className="signal-label">光纤串口 · 一对</Text>
  </>}</Drawing>;
}

export function ControlNetwork() {
  return <Drawing title="总控 DSP 经板内 EMIF 连接总控 FPGA；总控 FPGA 点对点连接 18 个高压侧 FPGA，每个高压侧再连接对应低压侧 FPGA" height={254}>{id => <>
    <rect x="153" y="9" width="228" height="235" fill="#fafafa" stroke="#aaa" strokeDasharray="5 4"/>
    <Text x={267} y={25}>总控板</Text>
    <Box x={170} y={43} w={194} h={60} label="DSP28377D" sub="交流采样 · 整机控制"/>
    <Box x={170} y={153} w={194} h={76} label="总控 FPGA" sub="同步 · 快速故障 · 数据" tone="signal"/>
    <Line d="M267 103 V153" id={id} both tone="signal"/>
    <Text x={309} y={128} anchor="start">EMIF</Text>
    <Text x={2} y={62} anchor="start">交流端口</Text><Text x={2} y={86} anchor="start">电压 / 电流</Text>
    <Line d="M100 74 H170" id={id} tone="signal" arrow/>
    <Box x={2} y={168} w={110} h={45} label="上位机"/>
    <Text x={57} y={233} className="sub-label">以太网</Text>
    <Line d="M170 191 H112" id={id} tone="signal" arrow/>
    <Text x={437} y={13} className="signal-label">18 组点对点链路</Text>
    <Text x={738} y={13} className="signal-label">每模块一对光纤串口</Text>
    {[['A1',51],['A2',120],['C6',207]].map(([label,y])=><g key={label}>
      <Box x={520} y={y-23} w={168} h={46} label={`高压 FPGA · ${label}`} tone="signal"/>
      <Box x={746} y={y-23} w={164} h={46} label={`低压 FPGA · ${label}`} tone="signal"/>
      <Line d={`M364 ${label==='A1'?169:label==='A2'?191:213} H${label==='A1'?415:label==='A2'?450:485} V${y} H520`} id={id} tone="signal" both/>
      <Line d={`M688 ${y} H746`} id={id} tone="signal" both/>
    </g>)}
    <Text x={602} y={162}>⋮</Text><Text x={827} y={162}>⋮</Text>
    <Text x={717} y={246} className="sub-label">代表节点；完整编号为 A1–A6、B1–B6、C1–C6</Text>
  </>}</Drawing>;
}

export function Coordination() {
  return <Drawing title="DSP 整机控制、FPGA 载波同步和故障处理的信息流；虚线为待确认的本地保护与联动动作" height={268}>{id => <>
    <Box x={1} y={20} w={174} h={61} label="DSP28377D" sub="整机控制指令"/>
    <Box x={244} y={20} w={184} h={61} label="总控 FPGA" sub="同步与快速处理" tone="signal"/>
    <Box x={523} y={20} w={179} h={61} label="高压侧 FPGA" sub="对应子模块" tone="signal"/>
    <Box x={767} y={20} w={144} h={61} label="低压侧 FPGA" sub="对应子模块" tone="signal"/>
    <Line d="M175 50 H244" id={id} tone="signal" arrow/>
    <Text x={209} y={98}>EMIF</Text>
    <Line d="M428 50 H523 M702 50 H767" id={id} tone="sync" arrow/>
    <Text x={477} y={98} className="sync-label">同步 / 指令</Text>
    <Text x={737} y={98} className="sync-label">转发</Text>
    <Line d="M839 81 V132 H612 V81" id={id} tone="signal" arrow/>
    <Line d="M612 132 H336 V81" id={id} tone="signal" arrow/>
    <Text x={736} y={153} className="signal-label">状态与采样反馈（拟定）</Text>
    <Box x={523} y={195} w={179} h={55} label="模块故障事件" tone="fault"/>
    <Box x={244} y={195} w={184} h={55} label="总控快速处理" tone="fault"/>
    <Box x={1} y={195} w={174} h={55} label="整机联动动作" sub="范围与策略待定" tone="fault"/>
    <Box x={767} y={195} w={144} h={55} label="本地保护" sub="触发条件待定" tone="fault"/>
    <Line d="M523 222 H428" id={id} tone="fault" arrow/>
    <Text x={477} y={183} className="fault-label">故障上报</Text>
    <Line d="M244 222 H175 M702 222 H767" id={id} tone="fault" arrow dashed/>
  </>}</Drawing>;
}
