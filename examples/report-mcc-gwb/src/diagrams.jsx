// 本 deck 专用示意图。MCC 的电路结构与波形一律用 plecs-studio/mcc/runs 的真实截图
// （见 src/assets/），此处只保留两幅与数据无关的版面示意。

export function ReportMap() {
  return <svg className="mg-diagram" viewBox="0 0 760 310" role="img" aria-label="汇报内容总览">
    <text x="380" y="30" textAnchor="middle" className="accent-t" fontSize="18">本次汇报：AI 工具实践两则</text>
    <rect x="20" y="55" width="350" height="230" rx="8" className="node"/>
    <text x="195" y="95" textAnchor="middle" className="accent-t" fontSize="18">① MCC 案例复盘</text>
    <text x="195" y="132" textAnchor="middle">一篇论文 ＋ 十一条提示</text>
    <text x="195" y="162" textAnchor="middle">模型 Opus 5 · 平台 PLECS Studio</text>
    <text x="195" y="192" textAnchor="middle">人给目标与简化，策略 AI 自己定</text>
    <text x="195" y="228" textAnchor="middle" className="node-title">产出：可闭环运行的系统</text>
    <rect x="390" y="55" width="350" height="230" rx="8" className="node"/>
    <text x="565" y="95" textAnchor="middle" className="accent-t" fontSize="18">② GWB 开放工作台</text>
    <text x="565" y="132" textAnchor="middle">Agent ＝ LLM ＋ Harness</text>
    <text x="565" y="162" textAnchor="middle">各家 Harness 封闭，绑定自家模型</text>
    <text x="565" y="192" textAnchor="middle">GWB：独立工作台，任意 Agent 接入</text>
    <text x="565" y="228" textAnchor="middle" className="node-title">插件生态：想做什么就做什么</text>
  </svg>;
}

export function GwbArchitecture() {
  return <svg className="mg-diagram" viewBox="0 0 860 260" role="img" aria-label="GWB 架构示意">
    {/* 左：任意 Agent */}
    <rect x="20" y="26" width="180" height="52" rx="6" className="node"/>
    <text x="110" y="58" textAnchor="middle" className="node-title">Agent A</text>
    <rect x="20" y="104" width="180" height="52" rx="6" className="node"/>
    <text x="110" y="136" textAnchor="middle" className="node-title">Agent B</text>
    <rect x="20" y="182" width="180" height="52" rx="6" className="node"/>
    <text x="110" y="214" textAnchor="middle" className="node-title">Agent C</text>
    <text x="110" y="250" textAnchor="middle" className="sub-label">任意模型 · 任意软件</text>
    {/* 双向箭头 */}
    <path className="flow" d="M208,52 H292 M208,130 H292 M208,208 H292"/>
    <polygon points="296,52 286,47 286,57" className="arrowhead"/>
    <polygon points="204,52 214,47 214,57" className="arrowhead"/>
    <polygon points="296,130 286,125 286,135" className="arrowhead"/>
    <polygon points="204,130 214,125 214,135" className="arrowhead"/>
    <polygon points="296,208 286,203 286,213" className="arrowhead"/>
    <polygon points="204,208 214,203 214,213" className="arrowhead"/>
    {/* 中：GWB 工作台 */}
    <rect x="300" y="26" width="250" height="208" rx="8" className="node-accent"/>
    <text x="425" y="60" textAnchor="middle" className="accent-t" fontSize="19">GWB 工作台</text>
    <path className="flow-thin" d="M320,74 H530"/>
    <text x="425" y="104" textAnchor="middle">统一接入：任何 Agent 可连</text>
    <text x="425" y="136" textAnchor="middle">服务索引 index</text>
    <text x="425" y="168" textAnchor="middle">命令调用 run</text>
    <text x="425" y="200" textAnchor="middle">说明检索 search</text>
    {/* 双向箭头 */}
    <path className="flow" d="M558,52 H622 M558,130 H622 M558,208 H622"/>
    <polygon points="626,52 616,47 616,57" className="arrowhead"/>
    <polygon points="554,52 564,47 564,57" className="arrowhead"/>
    <polygon points="626,130 616,125 616,135" className="arrowhead"/>
    <polygon points="554,130 564,125 564,135" className="arrowhead"/>
    <polygon points="626,208 616,203 616,213" className="arrowhead"/>
    <polygon points="554,208 564,203 564,213" className="arrowhead"/>
    {/* 右：自制插件 */}
    <rect x="630" y="26" width="200" height="52" rx="6" className="node"/>
    <text x="730" y="58" textAnchor="middle" className="node-title">自动备份</text>
    <rect x="630" y="104" width="200" height="52" rx="6" className="node"/>
    <text x="730" y="136" textAnchor="middle" className="node-title">论文管理</text>
    <rect x="630" y="182" width="200" height="52" rx="6" className="node-dash"/>
    <text x="730" y="214" textAnchor="middle" className="node-title">……（自制插件）</text>
    <text x="730" y="250" textAnchor="middle" className="sub-label">想做什么就做什么</text>
  </svg>;
}
