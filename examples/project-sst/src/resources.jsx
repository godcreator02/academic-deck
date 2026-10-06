import { Equation, MathText } from '@godcreator/academic-deck';

const tex = String.raw;
const ioRows = [
  ['光纤串口', '18 路 TX＋18 路 RX', 36],
  ['EMIF 数据', '16 位双向数据', 16],
  ['EMIF 地址', '暂定 8 根有效地址线', 8],
  ['EMIF 控制', 'CS、OE、WE、WAIT', 4],
  ['DSP 事件交互', '中断 / 握手预留', 2],
  ['以太网', 'RGMII 12＋PHY 管理 4', 16],
  ['时钟与逻辑复位', '单端时钟＋复位', 2],
  ['板级联锁与调试', '故障 / 联锁 8＋调试 4', 12],
];
const logicRows = [
  ['18 路 UART、帧解析、CRC', '2.5–5', '3–6'],
  ['EMIF、寄存器及读写控制', '0.5–1', '0.5–1'],
  ['同步、故障锁存与优先级', '0.3–0.8', '0.4–1.2'],
  ['数据调度与跨时钟域控制', '0.7–1.5', '0.8–2'],
  ['千兆 MAC＋UDP/IP/ARP', '3–6', '4–8'],
];

export function IoBudget() {
  return <div className="content sst resource-page">
    <p className="sst-note resource-premise"><strong>已确认：</strong>16 位 EMIF、以太网上位机。<strong>预算假设：</strong>单端光口 TX/RX，FPGA 内部 MAC＋UDP，外接千兆 RGMII PHY。</p>
    <div className="resource-columns">
      <section><table className="resource-table io-table"><caption><b className="caption-number">表 2</b>总控 FPGA 信号引脚预算</caption>
        <thead><tr><th>接口</th><th>配置 / 预留</th><th>引脚</th></tr></thead>
        <tbody>{ioRows.map(([name, detail, count])=><tr key={name}><td>{name}</td><td>{detail}</td><td>{count}</td></tr>)}
          <tr className="resource-total"><td>示例合计</td><td>含功能预留</td><td>{ioRows.reduce((n,r)=>n+r[2],0)}</td></tr>
        </tbody></table>
        <p className="sst-note resource-table-note">仅计总控到高压侧的 18 对串口；高低压侧之间的链路不占总控引脚。</p>
      </section>
      <section className="resource-aside"><h2>封装预留</h2><p className="resource-number">120–140 <span>个可用用户 I/O</span></p>
        <p>同步与故障暂按复用串口估算。</p>
        <div className="resource-rule"><h2>引脚映射边界</h2>
          <p className="sst-note">光模块每增加一路独立 LOS / 使能，可增加 18 个引脚；差分 TX/RX 的数据引脚变为 72 个。</p>
          <p className="sst-note">16 位 EMIF 最低地址位使用 EMxBA1；8 根地址线形成 256 个 16 位字的窗口，FIFO 可采用端口访问。</p>
          <p className="sst-note">配置与 JTAG 引脚另核；检查 Bank 电压、时钟脚及封装可用 I/O。</p>
        </div>
      </section>
    </div>
  </div>;
}

export function LogicBudget() {
  return <div className="content sst resource-page">
    <p className="sst-note resource-premise"><strong>初期规划区间，非 RTL 综合结果。</strong>按 6 输入 LUT 计；不含软核、DDR、长时间波形存储及大型调试缓存。</p>
    <div className="resource-columns">
      <section><table className="resource-table logic-table"><caption><b className="caption-number">表 3</b>逻辑资源预算（k＝1,000）</caption>
        <thead><tr><th>功能</th><th>LUT / k</th><th>FF / k</th></tr></thead>
        <tbody>{logicRows.map(row=><tr key={row[0]}>{row.map(cell=><td key={cell}>{cell}</td>)}</tr>)}
          <tr className="resource-total"><td>合计取整</td><td>7–15</td><td>9–19</td></tr>
        </tbody></table>
        <div className="resource-rule"><h2>逻辑开销主要来自通信</h2>
          <p>通信协议占主要预算；同步与故障锁存较轻。</p>
          <p className="sst-note">量级参考：AMD 某 Artix-7 RGMII 子系统配置占 2,477 LUT、4,178 FF、4 个 36 Kibit BRAM；不含本项目完整 UDP 业务逻辑。</p>
        </div>
      </section>
      <section className="resource-aside"><h2>缓存容量与 BRAM 映射</h2>
        <p>每路 TX、RX 各预留 512 B：</p>
        <Equation>{tex`18\times2\times512\,\mathrm{B}=18\,\mathrm{KiB}`}</Equation>
        <p className="sst-note">若 36 个 FIFO 各独占一个 18 Kibit 块，实际需要 36 个块，不能只用总字节数估计占用。</p>
        <div className="resource-rule"><p className="resource-number">48–64 <span>个 18 Kibit 等效块</span></p>
          <p className="sst-note">含以太网队列的初步缓存预留；最终取决于 FIFO 深度、独立端口与共享存储映射。</p>
          <p className="sst-note">大量 ILA 采样缓存需另计，器件选型同时核对 LUT、FF 和 BRAM。</p>
        </div>
      </section>
    </div>
  </div>;
}

export function BandwidthAndSelection() {
  return <div className="content sst resource-page bandwidth-page">
    <p className="sst-note resource-premise"><strong>算例：</strong>每模块每次回传 32 B 有效数据，更新率 20 kHz；UART 按 8N1，暂不计帧头和 CRC。参数尚未定稿。</p>
    <div className="sst-columns bandwidth-columns">
      <section><h2>通信带宽与时延</h2>
        <Equation>{tex`R_{\mathrm{UART}}=32\times20\,000\times10`}</Equation>
        <p className="resource-result"><MathText>{tex`R_{\mathrm{UART}}=6.4\,\mathrm{Mbit/s}`}</MathText> / 路</p>
        <Equation>{tex`R_{\mathrm{data}}=18\times32\times20\,000`}</Equation>
        <p className="resource-result"><MathText>{tex`R_{\mathrm{data}}=11.52\,\mathrm{MB/s}=92.16\,\mathrm{Mbit/s}`}</MathText></p>
        <p className="sst-note">该连续上传算例更适合千兆网；仅上传低速状态量时，可重新评估百兆方案。</p>
        <div className="resource-rule"><p><strong>故障优先级需要单独设计。</strong></p>
          <p className="sst-note">10 Mbaud 下，32 B 按 8N1 发送需 32 μs；快速故障不能默认等待普通数据队列。同步需确定发送与执行时刻。</p>
        </div>
      </section>
      <section><h2>候选器件的逻辑余量</h2>
        <table className="resource-table selection-table"><caption><b className="caption-number">表 4</b>按 7–15k LUT 预算比较</caption>
          <thead><tr><th>候选</th><th>实际 LUT</th><th>预计占用</th></tr></thead>
          <tbody><tr><td>Artix-7 35T</td><td>20,800</td><td>34%–72%</td></tr><tr><td>Artix-7 50T</td><td>32,600</td><td>21%–46%</td></tr></tbody>
        </table>
        <p className="sst-note resource-table-note">35T 可用于综合验证；50T 档留有更多调试与扩展空间。具体型号、封装及速度等级尚未选择。</p>
        <div className="resource-rule"><h2>建议的数据分流</h2>
          <p>控制所需量经 EMIF 交给 DSP；监测数据由 FPGA 汇聚后直接发往以太网。</p>
          <p className="sst-note">下一步：确定光口速率、帧长与更新率，再综合验证资源、EMIF 吞吐及最坏传输时延。</p>
        </div>
      </section>
    </div>
  </div>;
}

export const resourcePages = [
  {label:'I/O 预算',title:'总控 FPGA 的 I/O 预算',body:IoBudget,reference:<>[1] <a href="https://www.ti.com/lit/an/sprac96a/sprac96a.pdf" target="_blank" rel="noreferrer">TI SPRAC96A, §3.1–3.2</a>；[2] <a href="https://www.ti.com/lit/ds/symlink/dp83867ir.pdf" target="_blank" rel="noreferrer">TI DP83867IR：RGMII / 管理接口</a>。引脚数为方案预算。</>},
  {label:'逻辑与缓存',title:'总控 FPGA 的逻辑与缓存预算',body:LogicBudget,reference:<>[3] <a href="https://download.amd.com/docnav/documents/ip_attachments/axi-ethernet.html" target="_blank" rel="noreferrer">AMD AXI Ethernet 资源报告</a>；[4] <a href="https://docs.amd.com/r/en-US/ug953-vivado-7series-libraries/FIFO18E1" target="_blank" rel="noreferrer">AMD UG953：FIFO18E1</a>。项目占用待综合。</>},
  {label:'带宽与选型',title:'通信带宽与 FPGA 选型依据',body:BandwidthAndSelection,reference:<>[5] <a href="https://docs.amd.com/r/en-US/ug474_7Series_CLB/7-Series-FPGA-CLB-Resources" target="_blank" rel="noreferrer">AMD UG474：Artix-7 CLB 资源表</a>。带宽为假设算例；选型及占用比例待实现验证。</>},
];
