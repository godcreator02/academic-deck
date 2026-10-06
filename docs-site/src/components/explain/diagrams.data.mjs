/* ref file="../packages/academic-deck/src/index.js" hash="a1858a019f30" blob="2bc65dd344b9" */
/* ref file="../plugins/academic-deck/src/index.ts" lines="12-32" hash="97a0e20abf04" blob="e994b11881b2" */
export const system = {
 title: '一份汇报经过哪几层',
 nodes: [
  {id:'agent',title:'Agent',detail:'读制作流程，调用工作台命令。',external:true},
  {id:'plugin',title:'@godcreator/gwb-academic-deck',detail:'制作命令与完整 agent skill',capabilities:['deck.create · build · check · export','skills · 模板 · 检查与导出']},
  {id:'project',title:'汇报项目',detail:'保存 pages、数据和专属素材',capabilities:['src/slides.jsx','dist · .artifacts']},
  {id:'core',title:'@godcreator/academic-deck',detail:'纯 React 组件、样式与素材',capabilities:['Presentation · Equation · Figure','styles.css · assets']},
 ],
 edges:[
  {id:'1',from:'agent',to:'plugin',label:'调用',text:'① Agent → 插件：通过 gwb 调用四条 deck 写命令。'},
  {id:'2',from:'project',to:'core',label:'import',text:'② 项目 → 组件：项目固定组件版本，组件接收页面内容并渲染。'},
  {id:'3',from:'plugin',to:'project',label:'读写文件',disk:true,text:'③ 插件 → 项目：创建模板、构建 dist、写截图、报告和 PDF。'},
  {id:'4',from:'core',to:'plugin',label:'配套组件版本',disk:true,text:'④ 组件 → 插件：同一批次配套发布，构建时读取组件版本。完整 skill 与附件属于插件。'},
 ],
};
export const components = {
 title:'组件包怎样接住页面内容',
 nodes:[
  {id:'pages',title:'汇报项目',detail:'pages 数组与独立页面组件',external:true},
  {id:'presentation',title:'components/Presentation.jsx',detail:'放映入口',capabilities:['Presentation({ pages })','翻页 · 缩放 · 活动页']},
  {id:'content',title:'components + styles + assets',detail:'公共页面内容',capabilities:['Bookends · Math · Figure','AnimationTimeline · SlidePlayback']},
  {id:'browser',title:'浏览器 / 打印',detail:'屏幕显示或完整静态页面',external:true},
 ],
 edges:[
  {id:'1',from:'pages',to:'presentation',label:'pages',text:'① 项目传入 pages，Presentation 负责放映与活动页面。'},
  {id:'2',from:'pages',to:'content',label:'组件组合',text:'② 页面 body 组合公式、题注、电路和动画组件，项目额外导入公共样式。'},
  {id:'3',from:'presentation',to:'browser',label:'页面生命周期',text:'③ 放映与公共动画组件共同响应活动页、页面隐藏和打印，打印使用静态帧。'},
 ],
};
/* ref file="../plugins/academic-deck/build.ts" lines="7-19" hash="c0d373568b5b" blob="b8d1e25f8b4d" */
export const plugin = {
 title:'一次命令从入口到产物',
 nodes:[
  {id:'gwb',title:'gwbCommands / gwbSkills',detail:'工作台服务',external:true},
  {id:'entry',title:'src/index.ts + arguments.mjs',detail:'登记与参数校验',capabilities:['apply(ctx) · parseArguments','四条命令与制作 skill']},
  {id:'jobs',title:'src/jobs.mjs',detail:'目录任务生命周期',capabilities:['createJobs · run · dispose','同目录互斥 · 卸载取消']},
  {id:'execute',title:'执行器 + build.ts',detail:'文件、进程与打包',capabilities:['create · build-project · inspect','模板 · 驱动 · 版本']},
 ],
 edges:[
  {id:'1',from:'gwb',to:'entry',label:'登记 / 调用',text:'① 插件向工作台登记四条命令和 academic-deck skill。'},
  {id:'2',from:'entry',to:'jobs',label:'已校验参数',text:'② 校验绝对路径、可选参数与允许字段后，进入对应目录的任务。'},
  {id:'3',from:'jobs',to:'execute',label:'AbortSignal',text:'③ 任务传递取消信号；执行器负责子进程、临时服务和浏览器的清理。'},
  {id:'4',from:'execute',to:'entry',label:'构建文件',disk:true,text:'④ build.ts 打包命令实现与浏览器驱动，并写入配套组件版本。'},
 ],
};
