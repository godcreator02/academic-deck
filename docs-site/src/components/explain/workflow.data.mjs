/* ref file="../plugins/academic-deck/src/index.ts" lines="15-24" hash="dac599abe04b" blob="e994b11881b2" */
export const workflow = [
 {title:'创建',text:'Agent 调 deck.create，插件把起步模板写进新目录，并固定组件版本。已有目录会失败。',owner:'gwb 插件',artifact:'起步项目',lines:['command: deck.create','{"directory":"D:/reports/dab-weekly","title":"DAB 周报"}']},
 {title:'安装与编写',text:'在汇报目录安装依赖，然后编写 pages。正文、数据和专属素材由汇报项目保存。',owner:'汇报项目',artifact:'src/slides.jsx',lines:['cd D:/reports/dab-weekly','pnpm install','编辑 src/slides.jsx，替换示例数据']},
 {title:'构建',text:'deck.build 使用项目安装的 Vite，把当前源码编译到 dist。之后的检查只读取这份构建产物。',owner:'gwb 插件 → 项目 Vite',artifact:'dist/',lines:['command: deck.build','{"directory":"D:/reports/dab-weekly"}']},
 {title:'检查',text:'deck.check 打开 dist，检查资源、画布、溢出与打印并保存逐页截图。Agent 还要逐页审阅内容与视觉效果。',owner:'插件浏览器检查',artifact:'.artifacts/check.json · slide-N.png',lines:['command: deck.check','{"directory":"D:/reports/dab-weekly"}']},
 {title:'交付',text:'deck.export 再检查一次后写入新 PDF。网页交付整个 dist 并经 HTTP 放映。改过源码就重新构建和检查。',owner:'gwb 插件 / 汇报项目',artifact:'.artifacts/report.pdf 或 dist/',lines:['command: deck.export','{"directory":"D:/reports/dab-weekly"}']},
];
