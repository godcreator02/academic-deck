import { Chapter, Figure, MathText } from '@godcreator/academic-deck';
import { PowerChain, SystemTopology, SubmoduleCircuit, ControlNetwork, Coordination } from './diagrams';
import { resourcePages } from './resources';
import { schedulePages } from './schedule';

const tex = String.raw;
const projectSource = '方案依据：项目配置与控制架构；未确定的额定参数和实现细节另行标注。';

function Overview() {
  return <div className="content sst overview">
    <Figure number="1" caption="CHB＋DAB 固态变压器总体功率链路"><PowerChain/></Figure>
    <div className="sst-columns overview-bottom">
      <section><h2>系统配置</h2>
        <table><caption><b className="caption-number">表 1</b>项目主要配置</caption><tbody>
          <tr><th>交流接入</th><td><MathText>{tex`10\,\mathrm{kV}`}</MathText>，三相交流母线</td></tr>
          <tr><th>模块数量</th><td>每相 6 个，共 18 个子模块</td></tr>
          <tr><th>功率单元</th><td>两电平 H 桥＋DAB</td></tr>
          <tr><th>低压端口</th><td>公共直流母线，18 路并联</td></tr>
          <tr><th>总控平台</th><td>DSP28377D＋FPGA，16 位 EMIF</td></tr>
        </tbody></table>
      </section>
      <section><h2>方案关注点</h2>
        <p>CHB 做基本功率控制；DAB 控制子模块直流电压，隔离输出接入公共直流母线。</p>
        <p>整机控制由 DSP 承担，同步与快速故障处理由总控 FPGA 承担。</p>
        <p className="sst-note">待确定：直流输出电压、额定功率、模块直流电压及开关频率。</p>
      </section>
    </div>
  </div>;
}

function Topology() {
  return <div className="content sst topology">
    <Figure number="2" caption="三相 CHB＋DAB 功率结构（功率端口采用单线等效表示）"><SystemTopology/></Figure>
    <div className="sst-bottom two-notes"><p><strong>交流侧：</strong>每相 6 个 H 桥串联。<br/><strong>直流侧：</strong>18 个 DAB 输出接入同一母线。</p>
      <p className="sst-note">虚框代表一个子模块。相端接法、交流滤波与预充电回路待细化，本图不指定星形或三角形连接。</p></div>
  </div>;
}

function Module() {
  return <div className="content sst module">
    <Figure number="3" caption="单子模块功率电路与两侧控制器（理想开关示意）"><SubmoduleCircuit/></Figure>
    <div className="sst-bottom sst-columns">
      <section><p><strong>CHB：</strong>基本功率控制。<br/>高压侧 FPGA 覆盖 CHB 与 DAB 原边驱动。</p></section>
      <section><p><strong>DAB：</strong>控制子模块直流电压。<br/>低压侧 FPGA 驱动副边桥，输出接公共母线。</p></section>
    </div>
    <p className="sst-note circuit-note">子模块电压对应 <MathText>{tex`C_{\mathrm H}`}</MathText> 两端；<MathText>{tex`L_{\sigma}`}</MathText> 为等效传输电感。控制算法的具体执行位置与接口另行细化。</p>
  </div>;
}

function Controllers() {
  return <div className="content sst controllers">
    <Figure number="4" caption="总控与子模块控制网络（双箭头表示双向串行通信）"><ControlNetwork/></Figure>
    <div className="sst-bottom sst-columns"><section><h2>分布式控制</h2><p>每模块两颗 FPGA，共 36 颗；总控另配一颗 FPGA 和一颗 DSP。</p></section>
      <section><h2>光纤连接</h2><p>总控—高压侧 18 对串口；高压侧—低压侧 18 对串口。</p></section></div>
    <p className="sst-note">串口对数表示逻辑通信连接；波特率、协议、物理收发器及光纤芯数待定义。</p>
  </div>;
}

function Synchronization() {
  return <div className="content sst coordination">
    <Figure number="5" caption="同步、反馈与故障处理信息流（功能示意，非新增物理链路）"><Coordination/></Figure>
    <div className="sst-bottom sst-columns"><section><h2>载波同步</h2><p>总控 FPGA 负责同步；经高压侧到低压侧的具体传递机制、延时补偿和失步处理待定义。</p></section>
      <section><h2>故障处理</h2><p>总控 FPGA 负责快速处理；虚线路径为拟议动作，本地封锁条件及整机联动范围待确定。</p></section></div>
    <p className="sst-note">本页不预设同步精度或保护响应时间；状态反馈内容与链路调度需结合协议细化。</p>
  </div>;
}

export const pages = [
  { label:'Part 01', kind:'chapter', title:'项目方案与系统架构', body:()=> <Chapter number="01" title="项目方案与系统架构" subtitle="10 kV 交流接入 · CHB＋DAB 固态变压器"/> },
  { label:'项目总体方案', title:'CHB＋DAB 固态变压器方案', body:Overview, reference:projectSource },
  { label:'整机功率拓扑', title:'整机功率拓扑', body:Topology, reference:'项目结构：三相各 6 个子模块；18 路隔离输出并联至公共直流母线。' },
  { label:'单子模块结构', title:'单子模块结构与控制边界', body:Module, reference:<>DAB 拓扑参考：<a href="https://www.ti.com/tool/TIDA-010054" target="_blank" rel="noreferrer">Texas Instruments, TIDA-010054</a>；本项目参数另行设计。</> },
  { label:'控制通信架构', title:'控制器分工与光纤通信', body:Controllers, reference:projectSource },
  { label:'同步保护协同', title:'载波同步与故障处理协同', body:Synchronization, reference:'已确定：总控职责与物理连接；待细化：同步机制、反馈协议及保护动作。' },
  ...resourcePages,
  ...schedulePages,
];
