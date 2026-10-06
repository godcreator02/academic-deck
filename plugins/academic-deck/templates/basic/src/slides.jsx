import { Cover, Closing, Equation } from '@godcreator/academic-deck';
import { title } from './title.js';

function Content() {
  return <div className="content report-columns">
    <section><h2>研究问题</h2><p>在这里说明研究对象、边界条件和本次汇报的结论。</p></section>
    <section><h2>模型与证据</h2><Equation number="1">{String.raw`P=UI`}</Equation><p>用项目中的真实图表、公式和数据替换示例。</p></section>
  </div>;
}
export const pages = [
  { label: '封面', kind: 'cover', title, body: () => <Cover title={title} presenter="待填写"/> },
  { label: '研究内容', title: '研究问题与模型', body: Content, reference: '待填写参考文献与数据来源' },
  { label: '封底', kind: 'closing', title: '谢谢聆听', body: Closing },
];
