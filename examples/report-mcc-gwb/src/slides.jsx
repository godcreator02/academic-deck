import { Contents, Chapter, Closing, Figure } from '@godcreator/academic-deck';
import { DeckCover } from './DeckCover';
import { ReportMap, GwbArchitecture } from './diagrams';
import imgTop from './assets/mcc-top.png';
import imgValve from './assets/mcc-valve.png';
import imgNlm from './assets/mcc-nlm.png';
import imgInj from './assets/mcc-inj.png';
import imgCurrent from './assets/mcc-grid-current.png';
import imgVc from './assets/mcc-grid-vc.png';

const sourceSession = '聊天记录照录自与 Opus 5 的实际会话（PLECS Studio）；「AI·摘述」「复盘」为注记，非原文。';
const sourcePaper = '文献：R. Bai et al., "A Multilevel-DC-Link Converter With Single-Device Modules in Series for VSC-HVDC Application," IEEE Trans. Power Electron., vol. 39, no. 3, pp. 3353-3364, 2024.';
const sourceRuns = '截图：plecs-studio/mcc/runs/（open、inj-up、grid-n12），PLECS Studio 实际运行输出。';
const sourceGwb = 'GWB：自研独立工作台，本节为设计目的与用途介绍。';

function Overview() {
  return <div className="content meeting-overview">
    <section>
      <h2>AI 辅助科研的两个实践</h2>
      <p className="lead">主要论点：相信 AI 的判断——它有自己做控制策略的能力，很多时候只是人不懂</p>
      <p className="meta">杨道远<br/>9月22日</p>
      <p className="meeting-note">第一部分复盘一次真实会话：模型不认识 MCC，仅凭一篇论文与十一条提示做出可闭环运行的系统。过程按聊天记录如实呈现，波形与原理图取自实际运行输出。第二部分介绍自研 GWB 工作台。</p>
    </section>
    <Figure number="1" caption="本次汇报内容总览"><ReportMap/></Figure>
  </div>;
}

function Task() {
  return <div className="content meeting-columns">
    <section>
      <h2>起点条件与目标</h2>
      <div className="meeting-topics">
        <div><b>01</b><p><b>模型不认识 MCC。</b>开场先问「认识 MCC 拓扑不」，模型只答出几种常见拓扑。</p></div>
        <div><b>02</b><p><b>知识注入只有一篇论文。</b>清华赵彪课题组提出的 MCC 拓扑，此外没有其他资料。</p></div>
        <div><b>03</b><p><b>其余输入是十一条自然语言提示。</b>全程在 PLECS Studio 内完成，聊天记录见下一章。</p></div>
      </div>
      <p className="accent">目标：先跑通原理——做出可闭环运行（并网）的仿真系统。</p>
    </section>
    <section>
      <h2>开工前的简化拍板</h2>
      <ul className="meeting-list">
        <li>论文中每相 4 组 SDM＋HDM 子模块，用 H 桥等效代替。</li>
        <li>SM 先用一个子模块实现，随后直接做多个子模块。</li>
        <li>交流侧不走磁路：用三个独立绕组的电路变压器等效。</li>
        <li>先做开环，其余细节授权模型自行设计。</li>
      </ul>
      <p className="meeting-note">以上均为会话中人工拍板的简化决策；拓扑与术语以论文为准。</p>
    </section>
  </div>;
}

function ChatOne() {
  return <div className="content mg-chat">
    <div className="mg-chat-row me"><p className="mg-chat-bubble"><b className="mg-chat-who">人</b>你认识MCC拓扑不？我要搭建个基础的闭环模型学习原理，来个分步计划</p></div>
    <div className="mg-chat-row ai"><p className="mg-chat-bubble"><b className="mg-chat-who">AI·摘述</b>只列出几种常见拓扑——不认识 MCC。</p></div>
    <div className="mg-chat-row me"><p className="mg-chat-bubble"><b className="mg-chat-who">人</b>发你个论文看看，是清华赵彪他们的论文提出的MCC拓扑，不是你说的这几个常见的</p></div>
    <div className="mg-chat-row me"><p className="mg-chat-bubble"><b className="mg-chat-who">人</b>他说的什么每相4组SDM HDM你用个H桥来代替就行了，然后SM用一个子模块就行了，第一步我要先跑通原理。然后交流侧应该是个三相变压器，不如三个独立绕组，他画图这么画而已</p></div>
    <div className="mg-chat-row me"><p className="mg-chat-bubble"><b className="mg-chat-who">人</b>那直接做多个子模块好了，C-script排序选择</p></div>
    <div className="mg-chat-row me"><p className="mg-chat-bubble"><b className="mg-chat-who">人</b>先把开环做出来，变压器不要走磁路，就是电路的那个变压器。其他的你自己想</p></div>
  </div>;
}

function ChatTwo() {
  return <div className="content mg-chat">
    <div className="mg-chat-row me"><p className="mg-chat-bubble"><b className="mg-chat-who">人</b>现在这个开环电容电压会飘的是吗？避免我记得是有三次谐波注入的，三次谐波注入可以调压</p></div>
    <div className="mg-chat-row me"><p className="mg-chat-bubble"><b className="mg-chat-who">人</b>做吧。然后调压完了以后改成并网闭环，你自己想办法</p></div>
    <div className="mg-chat-row ai"><p className="mg-chat-bubble"><b className="mg-chat-who">AI·摘述</b>自主设计并网闭环控制方案并整定参数。</p></div>
    <div className="mg-chat-row me"><p className="mg-chat-bubble"><b className="mg-chat-who">人</b>不对，你加选择排序才对啊，加pwm干什么？</p></div>
    <div className="mg-chat-row ai"><p className="mg-chat-bubble"><b className="mg-chat-who">复盘</b>这次打断其实是我自己理解有偏差——AI 做的是对的。</p></div>
    <div className="mg-chat-row me"><p className="mg-chat-bubble"><b className="mg-chat-who">人</b>ok</p></div>
    <div className="mg-chat-row me"><p className="mg-chat-bubble"><b className="mg-chat-who">人</b>为什么波形有一堆pwm波形在里面？应该完全没有pwm啊，不是最近电平逼近吗？</p></div>
    <div className="mg-chat-row ai"><p className="mg-chat-bubble"><b className="mg-chat-who">复盘</b>波形本就是最近电平逼近、没有 PWM：抖得像 PWM 是因为子模块少，加到 12 个后就消失了。</p></div>
    <div className="mg-chat-row me"><p className="mg-chat-bubble"><b className="mg-chat-who">人</b>加子模块，就加到12个</p></div>
  </div>;
}

function RealModel() {
  return <div className="content mg-model">
    <section>
      <h2>实际模型：agent 搭的原理图</h2>
      <ul className="meeting-list">
        <li>整体主电路：每相 12 个子模块，三相共 36 个，由 agent 逐张摆位连线。</li>
        <li>单相变换器＝H 桥＋12 子模块串，对应论文的 subvalve。</li>
        <li>一个实验一个 runs/&lt;tag&gt;/ 目录：模型、stdout、Scope 截图齐全，可复现。</li>
      </ul>
      <p className="meeting-note">截图取自 plecs-studio/mcc/runs/grid-n12；模型正本与运行记录同目录。</p>
    </section>
    <Figure number="2" caption="并网轮整体主电路（runs/grid-n12）"><img src={imgTop} alt="MCC 并网轮整体主电路"/></Figure>
    <Figure number="3" caption="单相变换器：H 桥＋子模块串（schematic_valve）"><img src={imgValve} alt="单相变换器原理图"/></Figure>
  </div>;
}

function RealWaves() {
  return <div className="content mg-twofig">
    <Figure number="4" caption="开环轮：三相调制波为 NLM 阶梯，无载波（runs/open）"><img src={imgNlm} alt="开环轮 Scope 截图"/></Figure>
    <Figure number="5" caption="注入扫描轮：注入比例 k 改变电容电压工作点（runs/inj-up）"><img src={imgInj} alt="注入轮电容电压截图"/></Figure>
  </div>;
}

function FinalResult() {
  return <div className="content mg-final">
    <div className="mg-final-main">
      <Figure number="6" caption="并网轮：0.3 s 半载→满载电流阶跃（runs/grid-n12）"><img src={imgCurrent} alt="并网电流阶跃截图"/></Figure>
      <Figure number="7" caption="模块电容电压稳在 450 V 附近，扰动快速收敛"><img src={imgVc} alt="模块电容电压截图"/></Figure>
    </div>
    <div className="mg-final-bottom">
      <section>
        <h2>最终配置</h2>
        <table className="meeting-table"><tbody>
          <tr><th>拓扑</th><td>MCC（Multilevel-DC-Link Converter 同族）</td></tr>
          <tr><th>子模块</th><td>每相 12 个，三相共 36 个</td></tr>
          <tr><th>调制</th><td>NLM＋排序选择，三次谐波注入调压</td></tr>
          <tr><th>运行</th><td>并网闭环，0.3 s 负载阶跃，全链判分通过</td></tr>
        </tbody></table>
      </section>
      <section>
        <h2>一句话结论</h2>
        <p>一篇论文＋十一条提示，交付可闭环运行的系统。</p>
        <p className="accent">控制策略由 AI 自主设计——相信它的判断。</p>
      </section>
    </div>
  </div>;
}

function Retrospective() {
  return <div className="content meeting-summary">
    <p className="takeaway">相信 AI 的判断：AI 有自己做控制策略的能力，很多时候只是人不懂而已。</p>
    <div className="columns">
      <section>
        <h2>人做了什么（十一条提示）</h2>
        <ul className="meeting-list">
          <li>给题目与目标：从论文复现出可并网闭环的系统。</li>
          <li>拍板简化：H 桥等效、独立绕组、先开环、加到 12 个。</li>
          <li>方向确认：开环电容电压会飘 → 三次谐波注入调压。</li>
          <li>两次打断（排序、PWM）：事后看是我理解有偏差，AI 是对的。</li>
        </ul>
      </section>
      <section>
        <h2>AI 做了什么</h2>
        <ul className="meeting-list">
          <li>从论文提取结构，完成 PLECS 建模（36 个子模块逐张摆位）。</li>
          <li>自主设计并网闭环控制方案并整定参数。</li>
          <li>三次谐波注入调压、排序均衡的实现与调试。</li>
          <li>全链判分通过：调压、均衡、并网闭环指标全部达标。</li>
        </ul>
      </section>
    </div>
    <p className="meeting-status">两次打断，事后看都是我自己的理解有问题——这正是论点的例证：相信 AI 的判断。</p>
  </div>;
}

function PainPoints() {
  return <div className="content meeting-columns">
    <section>
      <h2>现状：Agent 正在变得封闭</h2>
      <ul className="meeting-list">
        <li>Agent ＝ LLM＋Harness（运行框架）：能力与消耗由两者共同决定。</li>
        <li>各家都在做自家的闭源 Harness。</li>
        <li>模型只与自家 Harness 搭配才达到最佳效果——任务质量与额度消耗都是。</li>
        <li>换模型、换软件就要重新搬家，自定义服务绑定在具体软件里。</li>
      </ul>
    </section>
    <section>
      <h2>想要的形态</h2>
      <div className="meeting-topics">
        <div><b>01</b><p>任意 Agent 皆可接入：不限模型、不限软件。</p></div>
        <div><b>02</b><p>自定义服务一处部署、处处可用。</p></div>
        <div><b>03</b><p>不用在几个软件之间搬来搬去。</p></div>
      </div>
      <p className="meeting-note">为此做了 GWB：一个完全独立的工作台（下一页）。</p>
    </section>
  </div>;
}

function GwbDesign() {
  return <div className="content mg-arch-page">
    <Figure number="8" caption="GWB 架构示意：任意 Agent 经统一入口使用自制插件"><GwbArchitecture/></Figure>
    <div className="mg-arch-bottom">
      <section>
        <h2>设计目标</h2>
        <p>完全独立的工作台：任何模型、任何软件里的 Agent 都能接入，访问全部自定义服务。</p>
      </section>
      <section>
        <h2>插件：想做什么就做什么</h2>
        <p>随意自制插件——例如自动备份、论文管理，想做什么就做什么。</p>
      </section>
    </div>
  </div>;
}

export const pages = [
  { label:'封面', kind:'cover', title:'AI 科研实践：MCC 复盘与 GWB 工作台', body:()=> <DeckCover title="AI 科研实践：MCC 复盘与 GWB 工作台" subtitle="组会汇报" presenter="杨道远　9月22日"/> },
  { label:'目录', kind:'contents', title:'汇报目录', body:()=> <Contents chapters={[
    { number:'01', title:'背景与任务', page:3 },
    { number:'02', title:'过程复盘', page:6 },
    { number:'03', title:'成果与复盘', page:11 },
    { number:'04', title:'GWB 工作台', page:14 },
  ]}/> },
  { label:'第一章', kind:'chapter', title:'背景与任务', body:()=> <Chapter number="01" title="背景与任务" subtitle="一篇论文能换来什么：起点条件与目标定义"/> },
  { label:'汇报概览', title:'汇报概览：两个 AI 实践', body:Overview, reference:'AI 工具实践两则：MCC 过程复盘 · GWB 工作台介绍' },
  { label:'任务设定', title:'任务设定：从一篇论文开始', body:Task, reference:sourcePaper },
  { label:'第二章', kind:'chapter', title:'过程复盘', body:()=> <Chapter number="02" title="过程复盘" subtitle="十一条提示的聊天记录，如实照录"/> },
  { label:'聊天记录一', title:'聊天记录 ①：提问与拍板', body:ChatOne, reference:sourceSession },
  { label:'聊天记录二', title:'聊天记录 ②：调压、并网与纠错', body:ChatTwo, reference:sourceSession },
  { label:'实际模型', title:'实际模型：agent 搭的 PLECS 原理图', body:RealModel, reference:sourceRuns },
  { label:'实际波形', title:'实际波形：开环与注入调压', body:RealWaves, reference:sourceRuns },
  { label:'第三章', kind:'chapter', title:'成果与复盘', body:()=> <Chapter number="03" title="成果与复盘" subtitle="从真实运行到论点：相信 AI 的判断"/> },
  { label:'系统成品', title:'系统成品：12 子模块并网闭环', body:FinalResult, reference:sourceRuns },
  { label:'人机复盘', title:'复盘：人机分工与论点', body:Retrospective, reference:sourceSession },
  { label:'第四章', kind:'chapter', title:'GWB 工作台', body:()=> <Chapter number="04" title="GWB 开放工作台" subtitle="任意 Agent，接入全部自定义服务"/> },
  { label:'现状痛点', title:'现状痛点：Harness 的封闭趋势', body:PainPoints, reference:sourceGwb },
  { label:'GWB 设计', title:'GWB 设计：统一接入与插件生态', body:GwbDesign, reference:sourceGwb },
  { label:'封底', kind:'closing', title:'谢谢', body:Closing },
];
