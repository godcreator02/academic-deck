import { Chapter, Figure } from '@godcreator/academic-deck';

const reference = '信息来源：汇报人了解到的张帆老师团队项目情况；具体日期、投入比例及试验范围未提供。';

function BenchmarkTimeline() {
  const points = [
    {x:95,month:'4 月',line1:'子模块硬件',line2:'控制板设计启动'},
    {x:382,month:'6 月',line1:'开始编写代码',line2:''},
    {x:810,month:'9 月',line1:'子模块调试完成',line2:''},
  ];
  return <svg className="sst-diagram schedule-diagram" viewBox="0 0 912 151" role="img" aria-label="对标项目4月开始子模块硬件和控制板设计，6月开始编写代码，9月完成子模块调试">
    <path d="M95 57 H810" fill="none" stroke="#737373" strokeWidth="2"/>
    <text x="237" y="46" textAnchor="middle" fill="#737373">约 2 个月</text>
    <text x="596" y="46" textAnchor="middle" fill="#737373">约 3 个月</text>
    {points.map(p=><g key={p.month}>
      <circle cx={p.x} cy="57" r="6" fill="#c00000"/>
      <text x={p.x} y="30" textAnchor="middle" className="schedule-month">{p.month}</text>
      <text x={p.x} y="95" textAnchor="middle">{p.line1}</text>
      <text x={p.x} y="124" textAnchor="middle" className="sub-label">{p.line2}</text>
    </g>)}
  </svg>;
}

function Benchmark() {
  return <div className="content sst schedule-benchmark">
    <Figure number="6" caption="张帆老师团队项目节点：4 月启动设计，9 月调通子模块"><BenchmarkTimeline/></Figure>
    <div className="sst-columns sst-bottom"><section><h2>参与人员与外部支持</h2>
      <table className="resource-table"><caption><b className="caption-number">表 5</b>对标项目人员配置</caption>
        <thead><tr><th>来源</th><th>配置</th></tr></thead><tbody>
          <tr><td>学校团队</td><td>1 名博士带 2 名研究生</td></tr>
          <tr><td>企业团队</td><td>4 名工程师参与</td></tr>
          <tr><td>PCB 布局</td><td>控制板原理图完成后另找人员画板</td></tr>
        </tbody></table><p className="sst-note resource-table-note">7 人参与，另有画板支持；投入比例未知，不折算人月。</p>
    </section><section><h2>已有经验与首版结果</h2>
      <p>团队在开展这版控制器之前，已有相关经验。</p>
      <p>本版控制板一次通过，没有返工；子模块制作也没有返工。</p>
      <p className="sst-note">9 月完成子模块调试；具体试验覆盖范围未提供。</p>
    </section></div>
  </div>;
}

export const schedulePages = [
  {label:'Part 02',kind:'chapter',title:'项目周期安排',body:()=> <Chapter number="02" title="项目周期安排" subtitle="张帆老师团队 · 项目进度与人员投入"/>},
  {label:'对标项目进度',title:'对标项目进度与人员投入',body:Benchmark,reference},
];
